import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { v4 as uuidv4 } from "uuid";
import { Types } from "mongoose";

import { AdvertService, CategoryEnum, OperationEnum } from "@advert";
import { CreateAdvertDto } from "@advert/dto";
import { SellerService } from "@seller";
import { objectToHash } from "@utils";
import { $Parse } from "@types";

import { DuplicateFinderService } from "./duplicate-finder/duplicate-finder.service";
import { OriginFinderService } from "./origin-finder/origin-finder.service";
import { ParsersService } from "./parsers/parsers.service";
import { NomaService } from "./noma/noma.service";

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name);

    constructor(
        private readonly sellerService: SellerService,
        private readonly advertService: AdvertService,
        private readonly duplicateFilter: DuplicateFinderService,
        private readonly originFinder: OriginFinderService,
        private readonly nomaService: NomaService,
        private readonly parserService: ParsersService,
    ) {}

    /**
     * Marks advert as copy and delete it from Noma
     * @param advertID {string} - id of copy
     */
    private async markAsCopy(advertID: string) {
        const advert = await this.advertService.markAsCopy(advertID);
        if (advert.metadata.noma.id) {
            await this.nomaService.deleteAdvert(advert.id);
        }
    }

    /**
     * Marks seller as realtor and updates his/her status on Noma
     * @param sellerID {string}
     */
    private async markAsRealtor(sellerID: string) {
        const seller = await this.sellerService.updateRealtorStatus(sellerID);
        await this.nomaService.updateUser(seller.id);
        return seller;
    }

    /**
     * Update seller status and marks all related adverts as copies
     * Scope: Local, Noma
     * @param sellerID {string} - id of seller
     */
    private async markAsRealtorAndCopies(sellerID: string) {
        const seller = await this.markAsRealtor(sellerID);
        const sellersAdverts = await this.advertService.getBySeller(seller.id);

        for (const advert of sellersAdverts) {
            await this.markAsCopy(advert.id);
        }
    }

    /**
     * Marks advert as duplicate of another
     * @param advertID {string}
     * @param copyID {string}
     * @private
     */
    private async markAsDuplicate(advertID: string, copyID: string) {
        const duplicate = await this.advertService.markAsDuplicate(advertID, copyID);

        if (duplicate.metadata.noma.id) {
            await this.nomaService.deleteAdvert(duplicate.id);
        }

        await this.markAsRealtor(duplicate.seller.toString());
    }

    /**
     * Creates a new Advert document and publish its data to Noma
     * @param data {CreateAdvertDto} - advert data
     * @param sellerID {string} - id of seller
     * @param parseData - data about parse process
     * @return advert document
     */
    private async createAndPublish(
        data: CreateAdvertDto,
        sellerID: string | Types.ObjectId,
        parseData: { resource: string; date: Date },
    ) {
        const advert = await this.advertService.create(data, sellerID, parseData);
        await this.nomaService.createAdvert(advert.id);
        return advert;
    }

    /**
     * Multistage new advert handler
     * - **Stage 1**: Validates parser data
     * - **Stage 2**: Creates of finds seller
     * - **Stage 3**: Finds duplicates
     * - **Stage 4**: Finds original
     * @param response {$Parse.$Response.$ParseNew} - parser response
     */
    public async validateIncomeAdvert(response: $Parse.$Response.$ParseNew) {
        // Note: use PID to track process in logs
        const PID = "NEW " + uuidv4().toString();

        this.logger.log(`Received new advert from ${response.data.advert.metadata.url}. Started process ${PID}`);

        // Note: check is advert already exists
        if (await this.advertService.getByOriginUrl(response.data.advert.metadata.url)) {
            this.logger.warn(`PID ${PID}: such advert already exists!`);
            return;
        }

        const { data } = response;
        const convertedAdvert = await this.validateNewAdvert(response);

        if (!convertedAdvert) {
            this.logger.warn(`PID ${PID}: advert is invalid!`);
            return;
        }

        const seller = await this.sellerService.getOrCreate(data.seller);
        const parseData = { resource: response.metadata.parser.name, date: response.metadata.time.finish };

        if (seller.isRealtor) {
            const advert = await this.advertService.create(convertedAdvert, seller._id, parseData, true);
            this.logger.log(`PID ${PID}: advert is from realtor! Created with id ${advert.id}`);
            return;
        }

        const { possibleDuplicates } = await this.duplicateFilter.findDuplicates(data.advert.data);

        if (possibleDuplicates.length > 0) {
            if (possibleDuplicates.length > 1) {
                this.logger.warn(`PID ${PID}: found multiple(${possibleDuplicates.length}) possible duplicates!`);
            }

            const { isOriginal, origin } = await this.originFinder.findOriginal(response, possibleDuplicates);

            if (!isOriginal) {
                this.logger.log(`PID ${PID}: advert is duplicate!`);
                await this.markAsRealtorAndCopies(seller.id);

                // Note: add parsed origin to original advert origins
                await this.advertService.addOrigin(origin, {
                    resource: response.metadata.parser.name,
                    url: data.advert.metadata.url,
                    id: data.advert.metadata.id,
                    created: data.advert.metadata.create,
                    lastUpdate: data.advert.metadata.lastUpdate,
                    lastPhoneUpdate: data.advert.metadata.lastUpdate,
                });
            } else {
                this.logger.log(`PID ${PID}: advert is original!`);

                // Note: create a new db record and send data to Noma
                const advert = await this.createAndPublish(convertedAdvert, seller._id, parseData);
                await Promise.all(possibleDuplicates.map((copyID) => this.markAsDuplicate(advert.id, copyID)));
            }
        } else {
            this.logger.log(`PID ${PID}: advert is original! (Duplicates not found)`);

            // Note: create a new db record and send data to Noma
            await this.createAndPublish(convertedAdvert, seller._id, parseData);
        }
    }

    /**
     * Advert update handler.
     * @param response {$Parse.$Response.$ParseUpdate} - parser response
     */
    public async validateIncomeUpdate(response: $Parse.$Response.$ParseUpdate) {
        // Note: use PID to track process in logs
        const PID = "UPDATE " + uuidv4().toString();
        this.logger.log(`Received update for ${response.request.data.id}. Started process ${PID}`);

        const dataHash = objectToHash(response.data.advert.data);

        // Note: update advert paring metadata
        const advert = await this.advertService.setUpdateMetadata(
            response.request.data.id,
            response.request.data.url,
            response.metadata.parser.name,
            Boolean(response.data.seller && Object.keys(response.data.seller).length),
        );

        // Note: check was seller updated (if was - update on Noma)
        if (response.data.seller && Object.keys(response.data.seller).length) {
            const { seller, updated } = await this.sellerService.updateData(
                advert.seller.toString(),
                response.data.seller,
            );
            if (updated) {
                await this.nomaService.updateUser(seller.id);
            }
        }

        // Note: check was advert updated (if was - update on Noma)
        if (dataHash !== advert.data.hash) {
            await this.advertService.updateRawData(response.request.data.id, response.data.advert.data);
            await this.nomaService.updateAdvert(advert.id);
            this.logger.log(`PID ${PID}: data was updated`);
        } else {
            this.logger.log(`PID ${PID}: data was not updated(advert has no changes)`);
        }
    }

    /**
     * Sends request to parse latest adverts
     * @param parser {string} parser name(same as queue name)
     * @param category {CategoryEnum} - category to parse
     * @param operation {OperationEnum} - operation to parse
     * @param limit {number} - limit of parsed adverts
     */
    public async requestToParseLatest(parser: string, category: CategoryEnum, operation: OperationEnum, limit: number) {
        await this.parserService.requestToParseLatest(parser, category, operation, limit);
    }

    /**
     * Filter parser latest advert to two arrays - new adverts and existing adverts,
     * then emit tasks to queue.
     * @param adverts {string[]} - array of parser adverts URls
     * @param parser {$Parse.$Parser} - data about parser
     */
    public async filterIncomeAdverts(adverts: string[], parser: $Parse.$Parser) {
        const { newURLs, existingURLs } = await this.advertService.filterNewAdverts(adverts);

        if (newURLs.length > 0) {
            await Promise.all(newURLs.map(async (url) => this.parserService.requestToParseNew(url, parser)));
            this.logger.log(`Send ${newURLs.length} request to parse as new`);
        }
        if (existingURLs.length > 0) {
            await Promise.all(existingURLs.map(async (url) => this.parserService.requestToParseUpdate(url, parser)));
            this.logger.log(`Send ${existingURLs.length} request to updates`);
        }
    }

    /**
     * Validates parsed advert and sellers data
     * @param response {$Parse.$Response.$ParseNew} - parser response
     */
    private async validateNewAdvert(response: $Parse.$Response.$ParseNew): Promise<false | CreateAdvertDto> {
        const { seller, advert } = response.data;

        const advertDto = plainToInstance(CreateAdvertDto, {
            data: { raw: advert.data },
            metadata: {
                origins: {
                    resource: response.metadata.parser.name,
                    url: advert.metadata.url,
                    id: advert.metadata.id,
                    created: advert.metadata.create,
                    lastUpdate: advert.metadata.lastUpdate,
                    lastPhoneUpdate: advert.metadata.lastUpdate,
                },
            },
        });
        const errors = await validate(advertDto);

        if (errors.length > 0) {
            errors.map((error) => {
                this.logger.error(`Validation error: ${JSON.stringify(error, null, 2)}`);
            });
            return false;
        }

        if (!!Boolean(seller && seller.name && seller.phones.length > 1)) {
            this.logger.log("Validation error: seller is not correct");
            return false;
        }

        return advertDto;
    }

    public async test() {
        const id = "651700fd2b2af2102a196c87";
        await this.nomaService.createAdvert(id);
    }
}

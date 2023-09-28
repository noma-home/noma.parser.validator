import { Injectable, Logger } from "@nestjs/common";

import { $Parse } from "@types";
import { objectToHash } from "@utils";
import { SellerService } from "@seller";
import { AdvertService } from "@advert";

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

    public async validateIncomeAdvert(response: $Parse.$Response.$ParseNew) {
        const { data } = response;
        const isValid = await AppService.validateNewAdvert(response);

        if (!isValid) {
            this.logger.log("Parser advert is not valid");
            return;
        }

        const seller = await this.sellerService.getOrCreate(data.seller);

        if (seller.isRealtor) {
            await this.advertService.create();
            return;
        }

        const { possibleDuplicates } = await this.duplicateFilter.findDuplicates(data.advert.data);

        if (possibleDuplicates.length > 0) {
            if (possibleDuplicates.length > 1) {
                this.logger.warn(`Found ${possibleDuplicates.length} possible duplicates`);
            }

            const { isOriginal, origin } = await this.originFinder.findOriginal(response, possibleDuplicates);

            if (!isOriginal) {
                this.logger.log("Parsed advert is not original");
                await this.sellerService.updateRealtorStatus(seller.id);
                await this.advertService.addOrigin(origin, {
                    resource: response.metadata.parser.name,
                    url: data.advert.metadata.url,
                    id: data.advert.metadata.id,
                    created: data.advert.metadata.time.create,
                    lastUpdate: data.advert.metadata.time.lastUpdate,
                    lastPhoneUpdate: data.advert.metadata.time.lastUpdate,
                });
            } else {
                this.logger.log("Parsed advert is original");
                const advert = await this.advertService.create();
                await Promise.all(possibleDuplicates.map((copyID) => this.advertService.markAsCopy(advert.id, copyID)));
            }
        } else {
            this.logger.log("Duplicates not found");
            const transformedAdvert = await this.nomaService.transformToNoma(data);
            await this.nomaService.publish(transformedAdvert);
        }
    }

    public async validateIncomeUpdate(response: $Parse.$Response.$ParseUpdate) {
        const dataHash = objectToHash(response.data.advert.data);
        const advert = await this.advertService.setUpdateMetadata(
            response.request.data.id,
            response.metadata.parser.name,
            Boolean(response.data.seller && Object.keys(response.data.seller).length),
        );

        if (dataHash !== advert.data.hash) {
            await this.advertService.updateRawData(response.request.data.id, response.data.advert.data);
        }
    }

    public async requestToParseLatest(parser: $Parse.$Parser, limit: number) {
        await this.parserService.requestToParseLatest(parser, limit);
    }

    public async filterIncomeAdverts(adverts: string[], parser: $Parse.$Parser) {
        const { newAdverts, existingAdverts } = await this.advertService.filterNewAdverts(adverts, parser);

        if (newAdverts.length > 0) {
            await Promise.all(newAdverts.map(async (url) => this.parserService.requestToParseNew(url, parser)));
        }
        if (existingAdverts.length > 0) {
            await Promise.all(existingAdverts.map(async (url) => this.parserService.requestToParseUpdate(url, parser)));
        }
    }

    private static async validateNewAdvert(response: $Parse.$Response.$ParseNew): Promise<boolean> {
        const { seller, advert } = response.data;
        return Boolean(
            seller && seller.name && seller.phones.length > 1 && advert.data.images.length > 0 && advert.data.area,
        );
    }
}

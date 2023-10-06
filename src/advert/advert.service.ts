import { FilterQuery, Model, Types } from "mongoose";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { CreateAdvertDto } from "@advert/dto";
import { flatten, objectToHash } from "@utils";

import { Advert, AdvertDocument } from "./schemas";

@Injectable()
export class AdvertService {
    private readonly logger = new Logger(AdvertService.name);

    constructor(@InjectModel(Advert.name) private readonly model: Model<AdvertDocument>) {}

    /**
     * Filters adverts
     * @param query {FilterQuery<AdvertDocument>} - filter query
     */
    public async filter(query: FilterQuery<AdvertDocument>): Promise<AdvertDocument[]> {
        return this.model.find(query).exec();
    }

    /**
     * Creates a new Advert document
     * @param data {CreateAdvertDto} - advert data
     * @param sellerID {string} - seller ID
     * @param parseData - parse process metadata
     * @param isCopy {boolean} - is advert copy
     */
    public async create(
        data: CreateAdvertDto,
        sellerID: string | Types.ObjectId,
        parseData: { resource: string; date: Date },
        isCopy: boolean = false,
    ): Promise<AdvertDocument> {
        const instance = new this.model(data);
        instance.seller = new Types.ObjectId(sellerID);
        instance.status.isCopy = isCopy;
        instance.data.hash = objectToHash(data.data.raw);
        instance.metadata.parsingHistory.push(parseData);
        return instance.save();
    }

    /**
     * Extends advert origins
     * @param id {string} - advert ID
     * @param origin - parsed origin
     */
    public async addOrigin(
        id: string,
        origin: { resource: string; url: string; id?: string; created: Date; lastUpdate: Date; lastPhoneUpdate: Date },
    ) {
        const instance = await this.model.findById(id);
        const urls = instance.metadata.origins.map((o) => o.url);

        if (!urls.includes(origin.url)) {
            await this.model.findByIdAndUpdate(id, { $push: { "metadata.origins": origin } });
        }
    }

    /**
     * Finds sellers adverts
     * @param sellerID {string} - seller ID
     */
    public async getBySeller(sellerID: string) {
        return this.model.find({ seller: sellerID }).exec();
    }

    /**
     * Sets *status.isCopy = true*
     * @param advertID {string} - advert ID
     */
    public async markAsCopy(advertID: string) {
        return this.model.findByIdAndUpdate(advertID, { "status.isCopy": true }, { new: true });
    }

    /**
     * Marks advert as duplicate of another advert
     * @param originID {string} - ID of original
     * @param copyID {string} - ID of duplicate
     */
    public async markAsDuplicate(originID: string, copyID: string) {
        const copy = await this.model.findByIdAndUpdate(copyID, { "status.isCopy": true }, { new: true });
        await this.model.findByIdAndUpdate(originID, { $push: { duplicates: copy.id } }, { new: true });
        this.logger.log(`Advert with ID ${copy.id} was marked as copy of advert ${originID}`);
        return copy;
    }

    /**
     * Filters array of URLs into two - new adverts and exiting adverts
     * @param urls { string[] } - array of parsed URLs
     */
    public async filterNewAdverts(urls: string[]): Promise<{ newURLs: string[]; existingURLs: string[] }> {
        const newURLs: string[] = [];
        const existingURLs: string[] = [];

        for (const url of urls) {
            const exists = await this.getByOriginUrl(url);
            if (exists) {
                existingURLs.push(url);
            } else {
                newURLs.push(url);
            }
        }

        return { newURLs, existingURLs };
    }

    /**
     * Finds advert document by ID
     * @param id { string } - advert ID
     */
    public async get(id: string) {
        return this.model.findById(id).exec();
    }

    /**
     * Finds all possible originals from array of IDs
     * @param possibleDuplicates { string[] } - array of possible duplicates IDs
     */
    public async getPossibleOrigins(possibleDuplicates: string[]): Promise<{ id: string; created: Date }[]> {
        return (
            await this.model.aggregate([
                {
                    $match: {
                        _id: { $in: possibleDuplicates.map((x) => new Types.ObjectId(x)) },
                    },
                },
                {
                    $unwind: "$metadata.origins",
                },
                {
                    $group: {
                        _id: "$_id",
                        oldestOriginDate: { $min: "$metadata.origins.created" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        id: "$_id",
                        oldestOriginDate: 1,
                    },
                },
            ])
        ).map((x) => ({ id: x.id.toString(), created: new Date(x.oldestOriginDate) }));
    }

    /**
     * Finds advert by origin URL
     * @param url {string} - origin URL
     */
    public async getByOriginUrl(url: string): Promise<AdvertDocument | null> {
        const adverts = await this.model.find({ "metadata.origins.url": url });

        if (adverts.length > 1) {
            this.logger.warn(
                `Warning: Found multiple adverts with same origin:\n${adverts.map((x) => x.id).join("\n")}`,
            );
        } else if (adverts.length < 1) {
            return null;
        } else {
            return this.model.findById(adverts[0]);
        }
    }

    /**
     * Updates parse metadata(parseHistory, origins timestamps)
     * @param id { string } - advert ID
     * @param url { string } - origin URL
     * @param resource { string } - resource name
     * @param withPhone { boolean } - was phone parsed
     */
    public async setUpdateMetadata(id: string, url: string, resource: string, withPhone: boolean = false) {
        const updateTime = new Date();
        const advert = await this.model.findById(id);
        const originIndex = advert.metadata.origins.findIndex((x) => x.url === url);
        const origin = advert.metadata.origins[originIndex];
        origin.lastUpdate = updateTime;

        if (withPhone) {
            origin.lastPhoneUpdate = updateTime;
        }

        advert.metadata.parsingHistory.push({ resource, date: updateTime });
        advert.metadata.origins[0] = origin;
        return advert.save();
    }

    /**
     * Updates data.raw
     * @param id {string} - advertID
     * @param data {Object} - update
     */
    public async updateRawData(id: string, data: Object) {
        await this.model.findByIdAndUpdate(id, flatten(data, "data.raw"), { new: true });
        return this.model.findByIdAndUpdate(id, { "data.hash": objectToHash(data) }, { new: true });
    }

    /**
     * Updates metadata.noma
     * @param id {string} - advert ID
     * @param nomaID {string} - advert ID on Noma
     * @param date {Date} - creation date
     */
    public async updateNomaData(id: string | Types.ObjectId, nomaID: string, date: Date) {
        return this.model.findByIdAndUpdate(id, { "metadata.noma": { id: nomaID, lastUpdate: date } });
    }
}

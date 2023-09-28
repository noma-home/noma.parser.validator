import { FilterQuery, Model } from "mongoose";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { $Parse } from "@types";
import { Advert, AdvertDocument } from "./schemas";

@Injectable()
export class AdvertService {
    private readonly logger = new Logger(AdvertService.name);

    constructor(@InjectModel(Advert.name) private readonly model: Model<AdvertDocument>) {}

    public async filter(query: FilterQuery<AdvertDocument>): Promise<AdvertDocument[]> {
        return this.model.find(query).exec();
    }

    public async create() {
        // TODO: implement
        return this.model.create({});
    }

    public async addOrigin(
        id: string,
        origin: { resource: string; url: string; id?: string; created: Date; lastUpdate: Date; lastPhoneUpdate: Date },
    ) {
        const advert = await this.model.findById(id);

        if (!advert.metadata.origins[origin.resource]) {
            advert.metadata.origins[origin.resource] = origin;
        }

        return advert.save();
    }

    public async markAsCopy(originID: string, copyID: string) {
        const copy = await this.model.findByIdAndUpdate(copyID, { "status.isCopy": true }, { new: true });
        const origin = await this.model.findByIdAndUpdate(originID, { $push: { duplicates: copy.id } }, { new: true });
        this.logger.log(`Advert with ID ${copy.id} was marked as copy of advert ${originID}`);
        return origin;
    }

    public async filterNewAdverts(
        urls: string[],
        parser: $Parse.$Parser,
    ): Promise<{ newAdverts: string[]; existingAdverts: string[] }> {
        const newAdverts: string[] = await this.model.find({ [`origins.${parser.name}.url`]: { $in: urls } });
        const existingAdverts: string[] = urls.filter((url) => !newAdverts.includes(url));

        return { newAdverts, existingAdverts };
    }

    public async get(id: string) {
        return this.model.findById(id).exec();
    }

    public async getPossibleOrigins(possibleOrigins: string[]): Promise<{ id: string; created: Date }[]> {
        const adverts = await this.model.find({ _id: { $in: possibleOrigins } });

        return adverts
            .map((ad) => {
                const oldestOrigin = Object.values(ad.metadata.origins)
                    .map((origin) => origin.created)
                    .sort((d1, d2) => d1.getTime() - d2.getTime())[0];
                return { id: ad._id, created: oldestOrigin };
            })
            .sort((ad1, ad2) => ad1.created.getTime() - ad2.created.getTime())
            .map((ad) => ({ id: ad.id.toString(), created: ad.created }));
    }

    public async getByOriginUrl(url: string): Promise<AdvertDocument | null> {
        const advertIDs = await this.model.aggregate([
            {
                $addFields: {
                    originsArray: {
                        $objectToArray: "$origins",
                    },
                },
            },
            {
                $match: {
                    "originsArray.v.url": url,
                },
            },
        ]);

        if (advertIDs.length > 1) {
            this.logger.warn(`Warning: Found multiple adverts with same origin:\n${advertIDs.join("\n")}`);
        } else if (advertIDs.length < 1) {
            return null;
        } else {
            return this.model.findById(advertIDs[0]);
        }
    }

    public async setUpdateMetadata(id: string, resource: string, withPhone: boolean = false) {
        const updateTime = new Date();
        const advert = await this.model.findOne({ id });
        advert.metadata.origins[resource].lastUpdate = updateTime;
        if (withPhone) {
            advert.metadata.origins[resource].lastPhoneUpdate = updateTime;
        }
        advert.metadata.parsingHistory.push({ resource, date: updateTime });
        return advert.save();
    }

    public async updateRawData(id: string, data: Object) {
        return this.model.findByIdAndUpdate(id, { "data.raw": data }, { new: true });
    }
}

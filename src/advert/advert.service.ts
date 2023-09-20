import { Model } from "mongoose";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Advert, AdvertDocument } from "./schemas/advert.schema";

@Injectable()
export class AdvertService {
    private readonly logger = new Logger(AdvertService.name);

    constructor(@InjectModel(Advert.name) private readonly model: Model<AdvertDocument>) {}

    public async filter(query: object): Promise<AdvertDocument[]> {
        return this.model.find(query);
    }

    public async create() {
        // TODO: implement
        return this.model.create({});
    }

    public async extendOrigin(id: string, origin: { resource: string; url: string; id?: string; lastParsed: Date }) {
        return this.model.findByIdAndUpdate(id, { $push: { origins: origin } }, { new: true });
    }

    public async markAsCopy(originID: string, copyID: string) {
        const copy = await this.model.findByIdAndUpdate(copyID, { isCopy: true }, { new: true });
        this.logger.log(`Advert with ID ${copy.id} was marked as copy of advert ${originID}`);
        return this.model.findByIdAndUpdate(originID, { $push: { duplicates: copy.id } }, { new: true });
    }
}

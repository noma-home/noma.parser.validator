import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Seller, SellerDocument } from "./schemas";

@Injectable()
export class SellerService {
    constructor(@InjectModel(Seller.name) private readonly model: Model<SellerDocument>) {}

    /**
     * Retrieves a seller document from the database based on the provided phones array.
     * If a seller document is found, it checks if extends seller data,
     * else - it creates a new seller document with the provided name, phones, and url.
     * @param seller - An object containing the name and phones of the seller, and an optional url.
     * @returns A Promise that resolves to the retrieved or created seller document.
     */
    public async getOrCreate({ name, phones, url }: { name: string; phones: string[]; url?: string }) {
        let seller = await this.model.findOne({ "account.phones": { $elemMatch: { $in: phones } } }).exec();
        name = name.toLowerCase().trim();

        if (seller) {
            if (!seller.account.names.includes(name)) {
                seller = await this.model.findByIdAndUpdate(
                    seller._id,
                    { $push: { "account.names": name } },
                    { new: true },
                );
            }

            if (url && !seller.account.urls.includes(url)) {
                seller = await this.model.findByIdAndUpdate(
                    seller._id,
                    { $push: { "account.urls": url } },
                    { new: true },
                );
            }

            const newPhones = phones.filter((phone) => !seller.account.phones.includes(phone));

            if (newPhones.length > 0) {
                seller = await this.model.findByIdAndUpdate(
                    seller._id,
                    { $push: { "account.phones": { $each: newPhones } } },
                    { new: true },
                );
            }

            return seller;
        }

        return this.model.create({
            isRealtor: false,
            account: { names: [name], phones, urls: [url!] },
        });
    }

    /**
     * Updates the isRealtor status.
     * @param id - The ID of the seller document to update.
     * @param isRealtor - The new value for the isRealtor field. If not provided, it defaults to true.
     * @returns A Promise that resolves to the updated seller document.
     */
    public async updateRealtorStatus(id: string, isRealtor: boolean = true) {
        return this.model.findByIdAndUpdate(id, { isRealtor }, { new: true });
    }
}

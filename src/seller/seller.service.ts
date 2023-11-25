import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Seller, SellerDocument } from "./schemas";

@Injectable()
export class SellerService {
    constructor(@InjectModel(Seller.name) private readonly model: Model<SellerDocument>) {}

    /**
     * Finds sellers document by ID
     * @param id - seller id
     */
    public async get(id: string) {
        return this.model.findById(id).exec();
    }

    /**
     * Retrieves a seller document from the database based on the provided phones array.
     * If a seller document is found, it checks if extends seller data,
     * else - it creates a new seller document with the provided name, phones, and url.
     * @param seller - An object containing the name and phones of the seller, and an optional url.
     * @returns A Promise that resolves to the retrieved or created seller document.
     */
    public async getOrCreate({ name, phones, url }: { name: string; phones: string[]; url?: string }) {
        let seller;

        if (phones !== undefined) {
            seller = await this.model.findOne({ "account.phones": { $elemMatch: { $in: phones } } }).exec();
            name = name.toLowerCase().trim();
        }

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

    /**
     * Updates sellers data if it changes
     * @param sellerID - seller id
     * @param data - update data
     * @return An object with seller and update status
     */
    public async updateData(sellerID: string, data: { name?: string; phones?: string[]; url?: string }) {
        let updated = false;
        let seller = await this.get(sellerID);

        if (data.name && !seller.account.names.includes(data.name)) {
            seller = await this.model.findByIdAndUpdate(
                sellerID,
                { $push: { "account.names": data.name } },
                { new: true },
            );
            updated = true;
        }

        if (Array.isArray(data.phones) && data.phones.length) {
            for (const phone of data.phones) {
                if (!seller.account.phones.includes(phone)) {
                    seller = await this.model.findByIdAndUpdate(
                        sellerID,
                        { $push: { "account.phones": phone } },
                        { new: true },
                    );
                    updated = true;
                }
            }
        }

        if (data.url && !seller.account.urls.includes(data.url)) {
            seller = await this.model.findByIdAndUpdate(
                sellerID,
                { $push: { "account.urls": data.url } },
                { new: true },
            );
            updated = true;
        }

        return { seller, updated };
    }

    /**
     * Updates sellers reference to Noma
     * @param sellerID {string} - seller ID
     * @param nomaID { string | null } - sellers ID in noma(or null if deleted)
     */
    public async updateNomaRef(sellerID: string, nomaID: string | null) {
        return this.model.findByIdAndUpdate(sellerID, { nomaID }, { new: true });
    }

    /**
     * Updates seller status by `nomaID`, returns `true` if updated, otherwise `false`
     * @param nomaID - target seller
     * @param data - update data
     */
    public async updateStatus(
        nomaID: string,
        data: { isRealtor?: boolean; isApprovedSeller?: boolean },
    ): Promise<boolean> {
        const output = await this.model.findOneAndUpdate({ nomaID }, { $set: data });
        return Boolean(output);
    }
}

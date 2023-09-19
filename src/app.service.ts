import { Injectable, Logger } from "@nestjs/common";

import { $Parse } from "./types";
import { SellerService } from "./seller/seller.service";
import { AdvertService } from "./advert/advert.service";

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name);

    constructor(private readonly sellerService: SellerService, private readonly advertService: AdvertService) {}

    public async validateAdvert(data: $Parse.$Response) {
        const isValid = await this.validate(data.advert);

        if (!isValid) {
            this.logger.log("Parser advert is not valid");
            // TODO: decide what to do if advert is not valid
            return;
        }

        const seller = await this.sellerService.getOrCreate(data.seller);

        if (seller.isRealtor) {
            // TODO: decide what to do
            return;
        }

        const possibleDuplicates = await this.findDuplicates(data);

        if (possibleDuplicates.length > 0) {
            this.logger.log(`Found ${possibleDuplicates.length} possible duplicates`);
            const { isOriginal, origin } = await this.findOrigin(data, possibleDuplicates);

            if (!isOriginal) {
                this.logger.log("Parsed advert is not original");
                await this.sellerService.updateRealtorStatus(seller.id);
                await this.advertService.extendOrigin(origin, { ...data.metadata, lastParsed: new Date() });
            } else {
                this.logger.log("Parsed advert is original");
                const advert = await this.advertService.create();
                await Promise.all(possibleDuplicates.map((copyID) => this.advertService.markAsCopy(advert.id, copyID)));
            }
        } else {
            this.logger.log("Duplicates not found");
            const transformedAdvert = await this.transform(data);
            await this.publish(transformedAdvert);
        }
    }

    private async validate(data: $Parse.$Advert): Promise<boolean> {
        return true;
    }

    private async findDuplicates(data: $Parse.$Response): Promise<string[]> {
        return [];
    }

    private async findOrigin(
        data: $Parse.$Advert,
        possibleDuplicates: string[],
    ): Promise<{ isOriginal: boolean; origin?: string }> {
        return { isOriginal: true };
    }

    // TODO: change return type
    private async transform(data: $Parse.$Response): Promise<Object> {
        return {};
    }

    // TODO: change `advert` type
    private async publish(advert: Object) {}
}

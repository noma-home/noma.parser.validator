import { Injectable, Logger } from "@nestjs/common";

import { $Parse, $Advert } from "./types";
import { SellerService } from "./seller/seller.service";
import { AdvertService } from "./advert/advert.service";
import { DuplicateFinderService } from "./duplicate-finder/duplicate-finder.service";
import { OriginFinderService } from "./origin-finder/origin-finder.service";

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name);

    constructor(
        private readonly sellerService: SellerService,
        private readonly advertService: AdvertService,
        private readonly duplicateFilter: DuplicateFinderService,
        private readonly originFinder: OriginFinderService,
    ) {}

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

        const { possibleDuplicates } = await this.duplicateFilter.findDuplicates(data);

        if (possibleDuplicates.length > 0) {
            this.logger.log(`Found ${possibleDuplicates.length} possible duplicates`);
            const { isOriginal, origin } = await this.originFinder.findOriginal(data, possibleDuplicates);

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

    private async validate(data: $Advert.$Advert): Promise<boolean> {
        return true;
    }

    // TODO: change return type
    private async transform(data: $Parse.$Response): Promise<Object> {
        return {};
    }

    // TODO: change `advert` type
    private async publish(advert: Object) {}
}

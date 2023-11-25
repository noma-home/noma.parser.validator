import { lastValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";
import { Inject, Injectable, Logger } from "@nestjs/common";

import { AdvertService } from "@advert";
import { SellerService } from "@seller";
import { $Advert } from "@types";

import { LocationService } from "./location.service";

interface $NomaResponse {
    id: string;
    date?: Date;
}

/**
 * Service responsible for sending advert-context RPC to Noma.
 */
@Injectable()
export class NomaService {
    private readonly logger = new Logger(NomaService.name);

    constructor(
        @Inject("NOMA_ADVERT_SERVICE") private readonly advertClient: ClientProxy,
        @Inject("NOMA_USER_SERVICE") private readonly userClient: ClientProxy,
        private readonly advertService: AdvertService,
        private readonly sellerService: SellerService,
        private readonly locationService: LocationService,
    ) {}

    public async convertLocation(location: $Advert.$Location): Promise<$Advert.$Location> {
        const region = await this.locationService.getRegion(location);
        const settlement = await this.locationService.getSettlement(location.settlement, region);
        const subRegion = await this.locationService.getSubRegion(settlement);
        const district = await this.locationService.getDistrict(location);
        const street = await this.locationService.getStreet(location, settlement, district);

        return {
            region,
            subRegion,
            settlement,
            district,
            street,
        };
    }

    /**
     * Creates a new advert
     * @param id - id of advert in noma.parser.db
     */
    public async createAdvert(id: string) {
        const instance = await this.advertService.get(id);
        let seller = await this.sellerService.get(instance.seller.toString());

        if (!seller.nomaID) {
            await this.createUser(seller.id);
            seller = await this.sellerService.get(seller.id);
        }

        const convertedLocation = await this.convertLocation(instance.data.raw.location);
        instance.data.raw.location = { ...convertedLocation, address: instance.data.raw.location.address };

        const payload: any = instance.data.raw;

        const response: $NomaResponse = await lastValueFrom(
            this.advertClient.send("advert:create", {
                advert: payload,
                seller: { id: seller.nomaID, name: seller.account.names[0] },
                contactSettings: { allowMessages: false, allowPhone: true },
            }),
        );

        if (!response.id) {
            this.logger.error(`Creation Error: advert ${instance.id}`);
            return;
        }
        await this.advertService.updateNomaData(instance.id, response.id, response.date);
    }

    /**
     * Updates exiting advert
     * @param id - id of advert in noma.parser.db
     */
    public async updateAdvert(id: string) {
        const instance = await this.advertService.get(id);

        const convertedLocation = await this.convertLocation(instance.data.raw.location);
        instance.data.raw.location = { ...convertedLocation, address: instance.data.raw.location.address };

        const response: $NomaResponse = await lastValueFrom(
            this.advertClient.send("advert:update", { id: instance.metadata.noma.id, data: instance.data.raw }),
        );
        if (!response.id) {
            this.logger.error(`Update Error: advert ${instance.id}`);
            return;
        }
        await this.advertService.updateNomaData(instance.id, response.id, response.date);
    }

    /**
     * Deletes exiting advert
     * @param id - id of advert in noma.parser.db
     */
    public async deleteAdvert(id: string) {
        const instance = await this.advertService.get(id);
        const response: { deleted: boolean } = await lastValueFrom(
            this.advertClient.send("advert:update", { id: instance.metadata.noma.id }),
        );
        if (!response.deleted) {
            this.logger.error(`Delete Error: advert ${instance.id}`);
            return;
        }
        await this.advertService.updateNomaData(instance.id, null, null);
    }

    /**
     * Creates a new User
     * @param sellerID - seller id
     */
    public async createUser(sellerID: string) {
        const instance = await this.sellerService.get(sellerID);
        const response = await lastValueFrom(
            this.userClient.send("user:create", {
                status: { isRealtor: instance.isRealtor },
                privacySettings: { showFullName: true, showPhoneNumber: true, allowMessages: false },
                data: {
                    firstName: instance.account.names[0].replace(/\b\w/g, (match) => match.toUpperCase()),
                    phones: instance.account.phones,
                },
            }),
        );

        if (!response.id) {
            this.logger.error(`Creation Error: user ${instance.id}`);
            return;
        }

        await this.sellerService.updateNomaRef(instance.id, response.id);
    }

    /**
     * Updates exiting user
     * @param id { string } - seller ID
     */
    public async updateUser(id: string) {
        const instance = await this.sellerService.get(id);

        const response: $NomaResponse = await lastValueFrom(
            this.userClient.send("user:update", {
                status: { isRealtor: instance.isRealtor },
                data: {
                    phones: instance.account.phones,
                },
            }),
        );

        if (!response.id) {
            this.logger.error(`Update Error: user ${instance.id}`);
            return;
        }

        return null;
    }

    /**
     * Deletes existing user
     * @param id { string } - seller ID
     */
    public async deleteUser(id: string) {
        const instance = await this.sellerService.get(id);

        if (instance.nomaID) {
            const response: { deleted: boolean } = await lastValueFrom(
                this.userClient.send("user:delete", { id: instance.id }),
            );

            if (!response.deleted) {
                this.logger.error(`Delete Error: seller ${instance.id}`);
                return;
            }
        }

        return null;
    }
}

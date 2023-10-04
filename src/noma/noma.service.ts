import { lastValueFrom } from "rxjs";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { AdvertService } from "@advert";

interface $NomaResponse {
    id: string;
    date: Date;
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
    ) {}

    /**
     * Creates a new advert
     * @param id - id of advert in noma.parser.db
     */
    public async createAdvert(id: string) {
        const instance = await this.advertService.get(id);
        const response: $NomaResponse = await lastValueFrom(this.advertClient.emit("advert:new", instance.data.raw));
        if (!response.id) {
            this.logger.error(`Creation Error: advert ${instance.id}`);
        }
        await this.advertService.updateNomaData(instance.id, response.id, response.date);
    }

    /**
     * Updates exiting advert
     * @param id - id of advert in noma.parser.db
     */
    public async updateAdvert(id: string) {
        const instance = await this.advertService.get(id);
        const response: $NomaResponse = await lastValueFrom(
            this.advertClient.emit("advert:update", { id: instance.metadata.noma.id, data: instance.data.raw }),
        );
        if (!response.id) {
            this.logger.error(`Update Error: advert ${instance.id}`);
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
            this.advertClient.emit("advert:update", { id: instance.metadata.noma.id, data: instance.data.raw }),
        );
        if (!response.deleted) {
            this.logger.error(`Delete Error: advert ${instance.id}`);
        }
        await this.advertService.updateNomaData(instance.id, null, null);
    }

    public async createUser() {
        // TODO: implement
    }

    public async updateUser(id: string, realtor?: boolean) {
        // TODO: implement
    }

    public async deleteUser() {
        // TODO: implement
    }
}

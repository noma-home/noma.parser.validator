import { EventPattern, Payload } from "@nestjs/microservices";
import { Controller, Logger } from "@nestjs/common";

import { $Parse } from "@types";

import { AppService } from "./app.service";

@Controller()
export class AppController {
    private readonly logger = new Logger(AppController.name);

    constructor(private readonly appService: AppService) {}

    @EventPattern("advert:new")
    public async validateNewAdvert(@Payload() response: $Parse.$Response.$ParseNew) {
        this.logger.log(`Event received. Pattern: "advert:new"\n Payload: ${JSON.stringify(response, null, 4)}`);
        await this.appService.validateIncomeAdvert(response);
    }

    @EventPattern("advert:update")
    public async validateAdvertUpdate(@Payload() response: $Parse.$Response.$ParseUpdate) {
        this.logger.log(`Event received. Pattern: "advert:update"\n Payload: ${JSON.stringify(response, null, 4)}`);
        await this.appService.validateIncomeUpdate(response);
    }

    @EventPattern("advert:latest")
    public async filterIDs(
        @Payload()
        response: $Parse.$Response.$ParseLatest,
    ) {
        this.logger.log(`Event received. Pattern: "advert:latest"\n Payload: ${JSON.stringify(response, null, 4)}`);
        await this.appService.filterIncomeAdverts(response.data.adverts, response.metadata.parser);
    }

    @EventPattern("parser:latest")
    public async parseLatest(@Payload() data: { parser: $Parse.$Parser; limit: number }) {
        this.logger.log(`Event received. Pattern: "parser:latest"\n Payload: ${JSON.stringify(data, null, 4)}`);
        await this.appService.requestToParseLatest(data.parser, data.limit);
    }
}

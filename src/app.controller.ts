import { EventPattern, Payload } from "@nestjs/microservices";
import { Controller } from "@nestjs/common";

import { $Parse } from "src/types";
import { AppService } from "./app.service";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @EventPattern("adverts:validate-income")
    public async validateAdvert(@Payload() data: $Parse.$Response) {
        await this.appService.validateIncomeAdvert(data);
    }

    @EventPattern("advert:filter-ids")
    public async filterIDs() {}
}

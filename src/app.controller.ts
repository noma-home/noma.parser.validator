import { EventPattern, Payload } from "@nestjs/microservices";
import { Controller, Logger } from "@nestjs/common";

import { ParseLatestRequest, ParseLatestResponseDto, ParserNewResponseDto, ParseUpdateResponseDto } from "./dto";
import { AppService } from "./app.service";

@Controller()
export class AppController {
    private readonly logger = new Logger(AppController.name);

    constructor(private readonly appService: AppService) {}

    @EventPattern("advert:new")
    public async validateNewAdvert(@Payload() response: ParserNewResponseDto) {
        await this.appService.validateIncomeAdvert(response);
    }

    @EventPattern("advert:update")
    public async validateAdvertUpdate(@Payload() response: ParseUpdateResponseDto) {
        await this.appService.validateIncomeUpdate(response);
    }

    @EventPattern("advert:latest")
    public async filterIDs(
        @Payload()
        response: ParseLatestResponseDto,
    ) {
        await this.appService.filterIncomeAdverts(response.data.adverts, response.metadata.parser);
    }

    @EventPattern("parse:latest")
    public async parseLatest(@Payload() data: ParseLatestRequest) {
        await this.appService.requestToParseLatest(data.parser, data.category, data.operation, data.limit);
        this.logger.log(`Sent parse latest request with options (${JSON.stringify(data)})`);
    }
}

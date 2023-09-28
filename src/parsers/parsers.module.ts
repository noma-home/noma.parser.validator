import { Module } from "@nestjs/common";

import { AdvertModule } from "@advert";

import { AppConfigModule } from "../app.config";
import { ParsersService } from "./parsers.service";
import { RmqClient } from "./rmq.client";

@Module({
    imports: [AppConfigModule, AdvertModule],
    providers: [ParsersService, RmqClient],
    exports: [ParsersService],
})
export class ParsersModule {}

import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";

import { AdvertModule } from "@advert";

import { DuplicateFinderService } from "./duplicate-finder.service";
import { Handler, DataHandler, ImageHandler } from "./handlers";

@Module({
    imports: [AdvertModule, HttpModule],
    providers: [DuplicateFinderService, Handler, DataHandler, ImageHandler],
    exports: [DuplicateFinderService],
})
export class DuplicateFilterModule {}

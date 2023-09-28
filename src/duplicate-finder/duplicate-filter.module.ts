import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";

import { AdvertModule } from "@advert";

import { DuplicateFinderService } from "./duplicate-finder.service";

@Module({
    imports: [AdvertModule, HttpModule],
    providers: [DuplicateFinderService],
    exports: [DuplicateFinderService],
})
export class DuplicateFilterModule {}

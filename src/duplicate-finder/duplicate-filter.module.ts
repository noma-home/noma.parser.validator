import { Module } from "@nestjs/common";
import { AdvertModule } from "../advert/advert.module";
import { DuplicateFinderService } from "./duplicate-finder.service";

@Module({
    imports: [AdvertModule],
    providers: [DuplicateFinderService],
    exports: [DuplicateFinderService],
})
export class DuplicateFilterModule {}

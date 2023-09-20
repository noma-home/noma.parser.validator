import { Module } from "@nestjs/common";

import { OriginFinderService } from "./origin-finder.service";
import { AdvertModule } from "src/advert/advert.module";

@Module({
    imports: [AdvertModule],
    providers: [OriginFinderService],
    exports: [OriginFinderService],
})
export class OriginFinderModule {}

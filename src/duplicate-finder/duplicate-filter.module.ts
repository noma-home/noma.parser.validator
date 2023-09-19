import { Module } from "@nestjs/common";
import { AdvertModule } from "../advert/advert.module";

@Module({
  imports: [AdvertModule],
})
export class DuplicateFilterModule {}

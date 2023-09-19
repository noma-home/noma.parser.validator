import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AdvertService } from "./advert.service";
import { Advert, AdvertSchema } from "./schemas";

@Module({
    imports: [MongooseModule.forFeature([{ name: Advert.name, schema: AdvertSchema }])],
    providers: [AdvertService],
    exports: [AdvertService],
})
export class AdvertModule {}

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { SellerController } from "./seller.controller";
import { Seller, SellerSchema } from "./schemas";
import { SellerService } from "./seller.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: Seller.name, schema: SellerSchema }])],
    controllers: [SellerController],
    providers: [SellerService],
    exports: [SellerService],
})
export class SellerModule {}

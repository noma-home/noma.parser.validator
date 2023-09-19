import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Seller, SellerSchema } from "./schemas";
import { SellerService } from "./seller.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: Seller.name, schema: SellerSchema }])],
    providers: [SellerService],
    exports: [SellerService],
})
export class SellerModule {}

import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { AppController } from "./app.controller";
import { AppConfigModule } from "./app.config";
import { AppService } from "./app.service";
import { SellerModule } from "./seller/seller.module";

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [AppConfigModule],

            useFactory: (configService: ConfigService) => {
                const user = configService.get<string>("MONGO_USER");
                const password = configService.get<string>("MONGO_PASSWORD");
                const host = configService.get<string>("MONGO_HOST");
                const port = configService.get<string>("MONGO_PORT");
                const dbName = configService.get<string>("MONGO_DB_NAME");

                return {
                    uri: `mongodb://${user}:${password}@${host}:${port}`,
                    dbName,
                };
            },
            inject: [ConfigService],
        }),
        SellerModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

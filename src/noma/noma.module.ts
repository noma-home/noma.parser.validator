import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, RmqOptions, Transport } from "@nestjs/microservices";

import { AppConfigModule } from "../app.config";
import { NomaService } from "./noma.service";

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                imports: [AppConfigModule],
                name: "NOMA_ADVERT_SERVICE",

                useFactory: (config: ConfigService): RmqOptions => {
                    const hostname = config.get<string>("RABBIT_HOST");
                    const port = config.get<number>("RABBIT_PORT");
                    const username = config.get<string>("RABBIT_USER");
                    const password = config.get<string>("RABBIT_PASSWORD");
                    const queue = config.get<string>("NOMA_ADVERT_API_QUEUE");

                    return {
                        transport: Transport.RMQ,
                        options: {
                            urls: [
                                {
                                    hostname,
                                    port,
                                    username,
                                    password,
                                },
                            ],
                            queue: queue,
                        },
                    };
                },

                inject: [ConfigService],
            },
        ]),
    ],
    providers: [NomaService],
    exports: [NomaService],
})
export class NomaModule {}

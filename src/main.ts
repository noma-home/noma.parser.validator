import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";

import { AppModule } from "./app.module";
import { Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [
        {
          hostname: configService.get<string>("RABBIT_HOST"),
          port: configService.get<number>("RABBIT_PORT"),
          username: configService.get<string>("RABBIT_USER"),
          password: configService.get<string>("RABBIT_PASSWORD"),
        },
      ],
      queue: configService.get<string>("RABBIT_QUEUE"),
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(parseInt(process.env.PORT || "3000"));
}

bootstrap();

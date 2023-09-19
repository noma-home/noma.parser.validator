import { EventPattern, Payload } from "@nestjs/microservices";
import { Controller } from "@nestjs/common";

import { $Parse } from "src/types";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern("validate:advert")
  public async validateAdvert(@Payload() data: $Parse.$Response) {}
}

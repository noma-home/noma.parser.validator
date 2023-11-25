import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { SellerService } from "./seller.service";
import { UpdateSellerDto } from "./dto";

@Controller()
export class SellerController {
    constructor(private readonly service: SellerService) {}

    @EventPattern("seller:update-status")
    public async updateStatus(@Payload() data: UpdateSellerDto) {
        return this.service.updateStatus(data.id, {
            isRealtor: data.isRealtor,
            isApprovedSeller: data.isApprovedSeller,
        });
    }
}

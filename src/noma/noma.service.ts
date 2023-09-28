import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class NomaService {
    private readonly logger = new Logger(NomaService.name);

    constructor(@Inject("NOMA_ADVERT_SERVICE") private readonly rmqClient: ClientProxy) {}

    public transformToNoma(...args: any[]) {
        // TODO: implement
        return {};
    }

    public async publish(...args: any[]) {
        // TODO: implement
    }
}

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AdvertService } from "@advert";
import { $Parse } from "@types";

import { RmqClient } from "./rmq.client";

/**
 * Service responsible for interacting with parsers and sending parsing requests.
 */
@Injectable()
export class ParsersService {
    private readonly logger = new Logger(ParsersService.name);

    constructor(
        private readonly rmqClient: RmqClient,
        private readonly advertService: AdvertService,
        private readonly configService: ConfigService,
    ) {}

    private async emitRequest(queue: string, message: $Parse.$Request.$Unknown): Promise<void> {
        await this.rmqClient.sendMessage(queue, message);
    }

    /**
     * Sends a request to parse the latest data using a specified parser and limit.
     *
     * @param parser - The parser configuration.
     * @param limit - The maximum number of items to parse.
     */
    public async requestToParseLatest(parser: $Parse.$Parser, limit: number) {
        await this.emitRequest(parser.queue, { pattern: "parse:latest", data: { limit } });
    }

    /**
     * Sends a request to parse new data for a specific URL using a specified parser.
     *
     * @param url - The URL of the new advert to parse.
     * @param parser - The parser configuration.
     */
    public async requestToParseNew(url: string, parser: $Parse.$Parser) {
        await this.emitRequest(parser.queue, { pattern: "parse:new", data: { id: url } });
    }

    /**
     * Sends a request to update parsing for a specific URL using a specified parser.
     * Evaluates whether phone parsing should be included based on a cooldown period.
     *
     * @param url - The URL to update parsing for.
     * @param parser - The parser configuration.
     */
    public async requestToParseUpdate(url: string, parser: $Parse.$Parser) {
        const now = Date.now();

        const message: $Parse.$Request.$ParseUpdate = {
            pattern: "parse:update",
            data: { id: url, withPhone: false },
        };
        const advert = await this.advertService.getByOriginUrl(url);

        if (!advert) {
            this.logger.error(`Error: not such advert with origin url\n${url}`);
            return;
        }

        const origin = Object.values(advert.metadata.origins).find((origin) => origin.url === url);
        const timeFromLastUpdate = (now - origin.lastPhoneUpdate.getTime()) / (1000 * 60 * 60);

        if (timeFromLastUpdate > this.configService.get<number>("PHONE_PARSE_COOL_DOWN", 72)) {
            message.data.withPhone = true;
        }

        await this.emitRequest(parser.queue, message);
    }
}

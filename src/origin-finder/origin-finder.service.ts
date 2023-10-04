import { Injectable, Logger } from "@nestjs/common";

import { AdvertService } from "@advert";
import { $Parse } from "@types";

/**
 * Service responsible for finding the original source of parsed advert.
 */
@Injectable()
export class OriginFinderService {
    private readonly logger = new Logger(OriginFinderService.name);

    constructor(private readonly advertService: AdvertService) {}

    /**
     * Finds the original source of parsed advert based on possible duplicate URLs and parsing response.
     *
     * @param parseResponse - The parsing response data.
     * @param possibleDuplicates - An array of possible duplicate URLs.
     * @returns An object indicating whether the data is original and, if not, the origin identifier.
     */
    public async findOriginal(
        parseResponse: $Parse.$Response.$ParseNew,
        possibleDuplicates: string[],
    ): Promise<{ isOriginal: boolean; origin?: string }> {
        const possibleOrigins = await this.advertService.getPossibleOrigins(possibleDuplicates);

        if (possibleOrigins.length === 0) {
            return { isOriginal: true };
        } else {
            if (possibleOrigins.length > 1) {
                this.logger.warn(
                    `Found more than one possible origins ${possibleOrigins.join(
                        ", ",
                    )}. Oldest one will be used as origin`,
                );
            }

            const oldest = possibleOrigins[0];

            if (oldest.created.getTime() - new Date(parseResponse.data.advert.metadata.create).getTime() > 0) {
                return { isOriginal: true };
            } else {
                return { isOriginal: false, origin: oldest.id };
            }
        }
    }
}

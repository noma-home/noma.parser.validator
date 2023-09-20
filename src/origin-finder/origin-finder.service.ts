import { Injectable } from "@nestjs/common";
import { AdvertService } from "src/advert/advert.service";
import { $Parse } from "src/types";

@Injectable()
export class OriginFinderService {
    constructor(private readonly advertService: AdvertService) {}

    public async findOriginal(
        parseResponse: $Parse.$Response,
        possibleDuplicates: string[],
    ): Promise<{ isOriginal: boolean; origin?: string }> {
        return { isOriginal: true };
    }
}

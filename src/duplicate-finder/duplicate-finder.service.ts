import { Injectable } from "@nestjs/common";

import { $Advert } from "@types";

import { $DuplicateFinder } from "./handlers/interfaces";
import { Handler } from "./handlers";

/**
 * Service responsible for finding and handling duplicate adverts.
 */
@Injectable()
export class DuplicateFinderService {
    constructor(private readonly handler: Handler) {}

    /**
     * Finds and handles duplicate adverts based on the provided advert data.
     *
     * @param advert - The advert data for which to find duplicates.
     * @returns A promise that resolves to the request for duplicate finding.
     */
    public async findDuplicates(advert: $Advert.$Advert): Promise<$DuplicateFinder.$Request> {
        return this.handler.start(advert);
    }
}

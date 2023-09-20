import { Injectable } from "@nestjs/common";

import { $Parse } from "src/types";
import { Handler } from "./handlers";
import { $DuplicateFinder } from "./handlers/interfaces";

@Injectable()
export class DuplicateFinderService {
    constructor(private readonly handler: Handler) {}

    public async findDuplicates(data: $Parse.$Response): Promise<$DuplicateFinder.$Request> {
        return this.handler.start(data.advert);
    }
}

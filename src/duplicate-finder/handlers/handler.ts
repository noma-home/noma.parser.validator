import { Injectable } from "@nestjs/common";

import { $Advert } from "src/types";
import { DataHandler } from "./data.handler";
import { ImageHandler } from "./image.handler";
import { $DuplicateFinder } from "./interfaces";

@Injectable()
export class Handler {
    public readonly handler: $DuplicateFinder.$Handler;

    constructor(private readonly dataHandler: DataHandler, private readonly imageHandler: ImageHandler) {
        this.handler = dataHandler.setNext(imageHandler);
    }

    public async start(advert: $Advert.$Advert) {
        return this.handler.handle({ advert, possibleDuplicates: [] });
    }
}

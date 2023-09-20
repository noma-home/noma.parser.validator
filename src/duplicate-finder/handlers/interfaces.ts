import { $Advert } from "src/types";

export namespace $DuplicateFinder {
    export interface $Request {
        advert: $Advert.$Advert;
        possibleDuplicates: string[];
    }

    export interface $Handler {
        setNext(handler: $Handler): void;
        handle(request: $Request): $Request | Promise<$Request>;
    }
}

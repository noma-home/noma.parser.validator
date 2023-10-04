import { $Advert } from "./advert";

export namespace $Parse {
    interface $Seller {
        name: string;
        phones: string[];

        /** Sellers profile url */
        url?: string;
    }

    interface $AdvertMetadata {
        create: Date;
        lastUpdate: Date;
        url: string;
        id?: string;
    }

    interface $Parser {
        /** Name of resource */
        name: string;

        /** Parser RMQ queue name */
        queue: string;
    }

    namespace $Request {
        interface _Request {
            pattern: "parse:new" | "parse:update" | "parse:latest";
        }

        interface $ParseNew extends _Request {
            pattern: "parse:new";
            data: {
                url: string;
            };
        }

        interface $ParseUpdate extends _Request {
            pattern: "parse:update";
            data: {
                id: string;
                url: string;
                withPhone: boolean;
            };
        }

        interface $ParseLatest extends _Request {
            pattern: "parse:latest";
            data: {
                limit: number;
                category: string;
                operation: string;
            };
        }

        type $Unknown = $ParseNew | $ParseUpdate | $ParseLatest;
    }

    namespace $Response {
        interface _Metadata {
            parser: $Parser;
            time: {
                start: Date;
                finish: Date;
            };
        }

        interface _Response {
            data: Object;
            metadata: _Metadata;
            request: $Request._Request;
        }

        interface $ParseNew extends _Response {
            data: {
                advert: {
                    data: $Advert.$Advert;
                    metadata: $AdvertMetadata;
                };
                seller: $Seller;
            };
            request: $Request.$ParseNew;
        }

        interface $ParseUpdate extends _Response {
            data: {
                advert: {
                    data: $Advert.$Advert;
                    metadata: $AdvertMetadata;
                };
                seller?: $Seller;
            };
            request: $Request.$ParseUpdate;
        }

        interface $ParseLatest extends _Response {
            data: {
                adverts: string[];
            };
            request: $Request.$ParseLatest;
        }
    }
}

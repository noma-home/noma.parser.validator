import { $Advert } from "./advert";

export namespace $Parse {
    interface $Seller {
        name: string;
        phones: string[];
        url?: string;
    }

    interface $ResponseMetadata {
        resource: string;
        url: string;
        id?: string;
        lastParsed: Date;
    }

    interface $Response {
        seller: $Seller;
        advert: $Advert.$Advert;
        metadata: $ResponseMetadata;
    }
}

export namespace $Parse {
    interface $Seller {
        name: string;
        phones: string[];
        url?: string;
    }

    interface $Advert {}

    interface $ResponseMetadata {
        resource: string;
        url: string;
        id?: string;
        lastParsed: Date;
    }

    interface $Response {
        seller: $Seller;
        advert: $Advert;
        metadata: $ResponseMetadata;
    }
}

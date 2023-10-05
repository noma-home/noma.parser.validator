export namespace $Advert {
    interface $Tag {
        name: string;
    }

    interface $BooleanTag extends $Tag {
        value: boolean;
    }

    interface $NumberTag extends $Tag {
        value: number;
    }

    interface $StringTag extends $Tag {
        value: string;
    }

    interface $MultipleStringTag extends $Tag {
        value: Array<string>;
    }

    type $AnyTag = $BooleanTag | $NumberTag | $StringTag | $MultipleStringTag;

    type $Category = "house" | "apartment";
    type $Operation = "sell" | "rent";

    type $Currency = "UAH" | "USD";

    interface $Area {
        total?: number;
        kitchen?: number;
        living?: number;
    }

    interface $Price {
        uah?: number;
        usd?: number;
        currency: $Currency;
    }

    interface $Anagraph {
        title: string;
        description: string;
    }

    interface $Location {
        region: string;
        subRegion?: string;
        settlement?: string;
        district?: string;
        neighborhood?: string;
        street?: string;
        itemNumber?: string;
    }

    interface $Room {
        totalNumber?: number;
        numberOfSeparated?: number;
        roomHeight?: string;
    }

    interface $Floor {
        numberOfFloors?: number;
        itemFloor?: number;
        isZeroLevelFloor?: boolean;
    }

    interface $Additional {
        balcony?: boolean;
        terrace?: boolean;
        loggia?: boolean;
    }

    interface $ItemShape {
        room: $Room;
        floor: $Floor;
        layout?: string;
        heating?: string;
        condition?: string;
        additional?: $Additional;
        pantry?: boolean;
        basement?: boolean;
    }

    interface $BuildingShape {
        buildingType: string;
        wall: string;
        numberOfFloors?: number;
        year?: string;
        elevator?: boolean;
    }

    interface $Shape {
        item: $ItemShape;
        building: $BuildingShape;
    }

    interface $Time {
        createdAt?: Date;
        lastUpdate?: Date;
    }

    export interface $Advert {
        category: $Category;
        operation: $Operation;
        area: $Area;
        shape: $Shape;
        price: $Price;
        anagraph: $Anagraph;
        location: $Location;
        householdAppliances: Array<$AnyTag>;
        multimedia: Array<$AnyTag>;
        extra: Array<$AnyTag>;
        images: Array<string>;
        time: $Time;
    }
}

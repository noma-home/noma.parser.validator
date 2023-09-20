import { $Advert } from "src/types";
import { AbstractHandler } from "./abstract.handler";
import { $DuplicateFinder } from "./interfaces";
import { flatten } from "src/utils";

type $FiledValue = boolean | number | string | undefined;

type $Filter = (value: $FiledValue, ...args: any[]) => any;

interface $Field {
    key: string;
    filter: $Filter;
}

const exectMatchFilter: $Filter = (value) => {
    return value;
};

const percentageRangeFilter: $Filter = (value, percentage: number = 5) => {
    if (value !== undefined && typeof value === "number") {
        const delta = (value * percentage) / 100;
        return { $lte: value - delta, $gte: value + delta };
    }
    return null;
};

const priceFilter: $Filter = (value: $FiledValue, scaler: number = 1) => {
    if (value !== undefined && typeof value === "number") {
        if (value <= 8000) {
            return 0.5 * scaler;
        }

        if (value <= 30000) {
            return 0.3 * scaler;
        }

        if (value <= 100000) {
            return 0.1 * scaler;
        }

        return 0.01 * scaler;
    }
    return null;
};

const fieldMapping: $Field[] = [
    { key: "category", filter: exectMatchFilter },
    { key: "operation", filter: exectMatchFilter },
    { key: "area.total", filter: percentageRangeFilter },
    { key: "area.kitchen", filter: percentageRangeFilter },
    { key: "price.uah", filter: (value) => priceFilter(value) },
    { key: "price.uad", filter: (value) => priceFilter(value, 0.2) },
    { key: "shape.item.room.totalNumber", filter: exectMatchFilter },
    { key: "shape.item.floor.itemFloor", filter: exectMatchFilter },
    { key: "shape.building.numberOfFloors", filter: exectMatchFilter },
    { key: "location.region", filter: exectMatchFilter },
    { key: "location.settlement", filter: exectMatchFilter },
    { key: "location.district", filter: exectMatchFilter },
    { key: "location.street", filter: exectMatchFilter },
];

/**
 * Step #1 Handler
 * Finds all possible duplicates using advert data (area, number of room, etc)
 */
export class DataHandler extends AbstractHandler {
    private generateQuery(advert: $Advert.$Advert) {
        const query: Record<string, any> = {};
        const flatAdvert = flatten(advert);

        for (const field of fieldMapping) {
            const value = flatAdvert[field.key];
            const filter = field.filter(value);
            if (filter) {
                query[field.key] = filter;
            }
        }

        return query;
    }

    public async handle(request: $DuplicateFinder.$Request): Promise<$DuplicateFinder.$Request> {
        request.possibleDuplicates = (await this.advertService.filter(this.generateQuery(request.advert))).map(
            (ad) => ad.id,
        );
        return super.handle(request);
    }
}

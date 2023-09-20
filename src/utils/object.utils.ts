interface FlattenedObject {
    [key: string]: any;
}

export function flatten(obj: object, parent = ""): FlattenedObject {
    const res: FlattenedObject = {};

    for (const [key, value] of Object.entries(obj)) {
        if (key.startsWith("$")) {
            res[parent] = { ...obj };
            return res;
        }

        const propName = parent ? `${parent}.${key}` : key;

        if (typeof value === "object" && value !== null) {
            Object.assign(res, flatten(value, propName));
        } else {
            res[propName] = value;
        }
    }

    return res;
}

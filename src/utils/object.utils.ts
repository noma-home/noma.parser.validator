/**
 * Represents a flattened object with string keys and any values.
 */
interface FlattenedObject {
    [key: string]: any;
}

/**
 * Recursively flattens a nested object, converting it into a flat structure
 * with string keys representing the nested structure.
 *
 * @param obj - The object to flatten.
 * @param parent - An optional parent key used for recursive flattening.
 * @returns The flattened object.
 */
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

/**
 * Converts an object into a hash code (integer) based on its JSON representation.
 *
 * @param obj - The object to convert to a hash code.
 * @returns The hash code for the object.
 */
export function objectToHash(obj: Object): number {
    const str = JSON.stringify(obj);
    let h: number = 0;
    for (let i = 0; i < str.length; i++) {
        h = 31 * h + str.charCodeAt(i);
    }
    return h & 0xffffffff;
}

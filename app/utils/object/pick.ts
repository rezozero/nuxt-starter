// lodash's `pick` for flat keys, without the ~20 KB of path helpers it pulls into the startup bundle.
// Same contract: a key is copied when `key in object`, so a Vue props object hands over every declared
// prop, `undefined` ones included.
export function pick<T extends object, K extends keyof T>(object: T, keys: readonly K[]): Pick<T, K>
export function pick<T extends object>(object: T, keys: readonly string[]): Partial<T>
export function pick(object: object, keys: readonly PropertyKey[]): Record<PropertyKey, unknown> {
    const result: Record<PropertyKey, unknown> = {}

    for (const key of keys) {
        if (key in object) result[key] = (object as Record<PropertyKey, unknown>)[key]
    }

    return result
}

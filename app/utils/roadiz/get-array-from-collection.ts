import type { HydraCollection, JsonLdObject } from '@roadiz/types'

export function getArrayFromCollection<T>(
    collection: HydraCollection<T> | Array<Omit<T, keyof JsonLdObject>> | unknown[],
): T[] {
    if (Array.isArray(collection)) return collection as T[]

    return 'hydra:member' in collection && Array.isArray(collection['hydra:member']) ? collection['hydra:member'] : []
}

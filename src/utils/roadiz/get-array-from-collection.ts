import { HydraCollection } from '@roadiz/abstract-api-client/dist/types/hydra'
import { JsonLdObject } from '@roadiz/abstract-api-client/dist/types/jsonld'

export function getArrayFromCollection<T>(collection: HydraCollection<T> | Array<Omit<T, keyof JsonLdObject>>): T[] {
    if (Array.isArray(collection)) return collection as T[]

    return 'hydra:member' in collection && Array.isArray(collection['hydra:member']) ? collection['hydra:member'] : []
}

import type { JsonLdObject } from '@roadiz/types'

/*
 * Matches a JsonLdObject with a specific @type name.
 * This method supports both NS and non-NS prefixed types.
 *
 * @see https://regex101.com/r/jPbnxj/1
 */
export function isEntityType(entity: JsonLdObject, type: string): boolean {
    const regex = new RegExp('^(?:NS)?' + type + '$', 'gi')
    const matches = entity['@type']?.match(regex)
    return matches !== null && matches.length > 0
}

/*
 * Matches a JsonLdObject with a schema.org namespace @type name.
 * This method supports http://schema.org, https://schema.org and none namespaced types.
 *
 * @see https://regex101.com/r/5way2I/1
 */
export function isSchemaOrgType(entity: JsonLdObject, type: string): boolean {
    const regex = new RegExp('^(?:https?:\\/\\/schema\\.org\\/)?' + type + '$', 'gi')
    const matches = entity['@type']?.match(regex)
    return matches !== null && matches.length > 0
}

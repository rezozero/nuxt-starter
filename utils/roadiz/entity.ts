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

export function isNodeType(entity: unknown): entity is JsonLdObject {
    return !!(entity && typeof entity === 'object' && '@id' in entity && '@type' in entity)
}

// NODE SOURCE
export function isPageEntity(entity: JsonLdObject): boolean {
    return isEntityType(entity, 'Page')
}

export function isBlogPostEntity(entity: JsonLdObject): boolean {
    return isEntityType(entity, 'BlogPost')
}

export function isBlogListingEntity(entity: JsonLdObject): boolean {
    return isEntityType(entity, 'BlogPostContainer')
}

// BLOCKS
export function isContentBlock(entity: JsonLdObject): boolean {
    return isEntityType(entity, 'ContentBlock')
}

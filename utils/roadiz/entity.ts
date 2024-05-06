import type { JsonLdObject } from '@roadiz/types'

export function isNodeType(entity: unknown): entity is JsonLdObject {
    return !!(entity && typeof entity === 'object' && '@id' in entity && '@type' in entity)
}

export function isEntityType(entity: JsonLdObject, type: string): boolean {
    const regex = new RegExp('^(NS)?' + type + '$', 'gi')
    const matches = entity['@type']?.match(regex)
    return matches !== null && matches.length > 0
}

export function isSchemaOrgType(entity: JsonLdObject, type: string): boolean {
    const regex = new RegExp('^(?:https?:\\/\\/schema\\.org\\/)?' + type + '$', 'gi')
    const matches = entity['@type']?.match(regex)
    return matches !== null && matches.length > 0
}

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

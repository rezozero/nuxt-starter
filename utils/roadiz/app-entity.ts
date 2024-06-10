import type { JsonLdObject } from '@roadiz/types'
import { isEntityType } from '~/utils/roadiz/entity'

// TYPE GUARD
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

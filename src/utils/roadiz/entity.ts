import { JsonLdObject } from '@roadiz/abstract-api-client/dist/types/jsonld'

export function isEntityType(entity: JsonLdObject, type: string): boolean {
    return entity['@type'] === type
}

export function isEventEntity(entity: JsonLdObject): boolean {
    return isEntityType(entity, 'http://schema.org/Event')
}

export function isPersonEntity(entity: JsonLdObject): boolean {
    return isEntityType(entity, 'http://schema.org/Person')
}

export function isPageEntity(entity: JsonLdObject): boolean {
    return isEntityType(entity, 'Page')
}

export function isBlogPostContainerEntity(entity: JsonLdObject): boolean {
    return isEntityType(entity, 'BlogPostContainer')
}

export function isBlogPostEntity(entity: JsonLdObject): boolean {
    return isEntityType(entity, 'BlogPost')
}

export function isEventListingEntity(entity: JsonLdObject): boolean {
    return isEntityType(entity, 'EventListing')
}

export function isSeasonEntity(entity: JsonLdObject): boolean {
    return isEntityType(entity, 'https://schema.org/Season')
}

export function isTagEntity(entity: JsonLdObject): boolean {
    return isEntityType(entity, 'Tag')
}

export function isProductionEntity(entity: JsonLdObject): boolean {
    return isEntityType(entity, 'Production')
}

export function isProductionListingEntity(entity: JsonLdObject): boolean {
    return isEntityType(entity, 'ProductionListing')
}

export function isDocumentListingEntity(entity: JsonLdObject): boolean {
    return isEntityType(entity, 'DocumentListing')
}

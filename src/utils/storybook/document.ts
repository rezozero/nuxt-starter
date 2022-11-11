import { RoadizDocument } from '@roadiz/abstract-api-client/dist/types/roadiz'

export function createDocument(document?: Partial<RoadizDocument>): RoadizDocument {
    return {
        ...document,
        '@id': 'storybook',
        '@type': 'document',
        processable: false,
    }
}

export function createImage(document?: Partial<RoadizDocument>): RoadizDocument {
    return {
        ...createDocument(document),
        processable: true,
    }
}

import { RoadizDocument } from '@roadiz/abstract-api-client/dist/types/roadiz'

export function createImage(document?: Partial<RoadizDocument>): RoadizDocument {
    return {
        ...document,
        '@id': 'storybook',
        '@type': 'document',
        // relativePath: '/',
        processable: true,
    }
}

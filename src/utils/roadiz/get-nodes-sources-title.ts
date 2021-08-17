import { RoadizNodesSources } from '@roadiz/abstract-api-client/dist/types/roadiz'

export default function getNodesSourcesTitle(data: RoadizNodesSources | undefined): string | undefined {
    return data?.metaTitle || data?.title
}

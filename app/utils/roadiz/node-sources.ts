import type { RoadizNodesSources } from '@roadiz/types'

type ApiNodeSource = RoadizNodesSources & { name?: string }

export default function getNodesSourcesTitle(data: ApiNodeSource | undefined) {
    return data?.metaTitle || data?.title || data?.name
}

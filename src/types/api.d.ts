import {
    RoadizAlternateLink,
    RoadizNodesSources,
    RoadizNodesSourcesHead,
    RoadizWalker,
    RoadizWebResponse,
} from '@roadiz/abstract-api-client/dist/types/roadiz'

interface PageResponse {
    page: RoadizWebResponse
    alternateLinks?: RoadizAlternateLink[]
}

interface CommonContent {
    home?: RoadizNodesSources
    head?: RoadizNodesSourcesHead
    menus?: Record<string, RoadizWalker>
    footers?: Record<string, RoadizWalker>
}

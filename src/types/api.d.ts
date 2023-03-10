import {
    RoadizAlternateLink,
    RoadizNodesSources,
    RoadizWalker,
    RoadizWebResponse,
} from '@roadiz/abstract-api-client/dist/types/roadiz'

interface PageResponse {
    page: RoadizWebResponse
    alternateLinks?: RoadizAlternateLink[]
}

interface CommonContent {
    home?: RoadizNodesSources
    head?: RoadizNodesSources
    menus?: Record<string, RoadizWalker>
    footers?: Record<string, RoadizWalker>
}

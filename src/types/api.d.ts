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
    mainMenuWalker?: RoadizWalker
    home?: RoadizNodesSources
}

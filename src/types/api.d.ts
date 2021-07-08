import { RoadizNodesSources } from '@roadiz/abstract-api-client/dist/types/roadiz'
import { AlternateLink } from '@roadiz/abstract-api-client/dist/types/roadiz-api'

interface PageResponse {
    page: RoadizNodesSources
    alternateUrls?: AlternateLink[]
}

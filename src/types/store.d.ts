import { NuxtError } from '@nuxt/types'
import { RoadizAlternateLink, RoadizNodesSources, RoadizWalker } from '@roadiz/abstract-api-client/dist/types/roadiz'
import { PageResponse } from '~/types/api'

interface RootState {
    firstPageData: PageResponse | null
    firstPageError: NuxtError | null
    previousPageData: PageResponse | null
    nextPageData: PageResponse | null
    mainMenuData: RoadizWalker | null
    homeData: RoadizNodesSources | null
    windowWidth: number
    windowHeight: number
    alternateLinks: RoadizAlternateLink[]
    prefersReducedMotion: boolean
    scrollIsDisabled: boolean
}

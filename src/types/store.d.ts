import { NuxtError } from '@nuxt/types'
import { CommonContent, PageResponse } from '~/types/api'

interface RootState {
    firstPageData: PageResponse | null
    firstPageError: NuxtError | null
    previousPageData: PageResponse | null
    nextPageData: PageResponse | null
    currentPageData: PageResponse | null
    commonContent: CommonContent | null
    windowWidth: number
    windowHeight: number
    prefersReducedMotion: boolean
    scrollIsDisabled: boolean
}

import { NuxtError } from '@nuxt/types'
import {RoadizHead, RoadizWalker} from "@roadiz/abstract-api-client/dist/types/roadiz";
import {PageResponse} from "~/types/api";

interface RootState {
    firstPageData: PageResponse | null
    firstPageError: NuxtError | null
    previousPageData: PageResponse | null
    nextPageData: PageResponse | null
    headData: RoadizHead | null
    mainMenuData: RoadizWalker | null
    windowWidth: number
    windowHeight: number
    alternateUrls: string
}

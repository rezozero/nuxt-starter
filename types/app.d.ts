import type { RoadizWebResponse, RoadizWalker } from '@roadiz/types'

export type PageEntityProps = {
    webResponse?: RoadizWebResponse
}

export interface UseRoadizBlockProps {
    walker: RoadizWalker
    index: number
    blocks?: RoadizWalker[]
    numBlocks?: number | string
}

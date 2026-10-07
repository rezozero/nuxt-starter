import type { RoadizWalker, RoadizWebResponse } from '@roadiz/types'

export type PageEntityProps = {
    webResponse?: RoadizWebResponse
}

export interface UseRoadizBlockProps {
    walker: RoadizWalker
    index: number
    blocks?: RoadizWalker[]
    numBlocks?: number | string
}

export type ComponentOrTagName
    = | string
        | Component
        | ConcreteComponent
        | Raw<DefineComponent>

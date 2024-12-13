import type { RoadizNodesSources, RoadizWalker } from '@roadiz/types'

// Update based on project specificities
export type AppMenuItem = RoadizNodesSources
export type AppPageItem = RoadizNodesSources

export type PageComponentProps<T = ReachableItem> = {
    item: T
    blocks?: RoadizWalker[]
}

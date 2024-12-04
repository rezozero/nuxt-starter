import type { RoadizWalker } from '@roadiz/types'
import type { UnionToIntersection } from '~/utils/types'
import type { NSMenu, NSMenuLink, NSPage } from '~/types/roadiz'

export type ChildrenMenuType = NSMenu | NSMenuLink | NSPage
export type ChildrenMenuTypeMerged = Partial<UnionToIntersection<ChildrenMenuType>>

export type ReachableItem = NSPage
export type ReachableItemMerged = Partial<UnionToIntersection<ReachableItem>>

export type PageComponentProps<T = ReachableItem> = {
    item: T
    blocks?: RoadizWalker[]
}

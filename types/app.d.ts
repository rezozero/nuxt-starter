import type { UnionToIntersection } from '~/utils/types'
import type { RoadizNodeType } from '@roadiz/types'

export type MenuNodeType = RoadizNodeType
export type MenuNodeKeyMerged = Partial<UnionToIntersection<MenuNodeType>>

export type ReachableItem = RoadizNodeType
export type ReachableItemMerged = Partial<UnionToIntersection<ReachableItem>>

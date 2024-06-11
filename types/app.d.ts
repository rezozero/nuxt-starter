import type { UnionToIntersection } from '~/utils/types'
import type { RoadizNodesSources } from '@roadiz/types'

export type MenuNodeType = RoadizNodesSources
export type MenuNodeKeyMerged = Partial<UnionToIntersection<MenuNodeType>>

export type ReachableItem = RoadizNodesSources
export type ReachableItemMerged = Partial<UnionToIntersection<ReachableItem>>

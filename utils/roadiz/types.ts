import type { JsonLdObject, RoadizNodesSources } from '@roadiz/types'

export interface RoadizWalkerKnown<T = RoadizNodesSources, C = RoadizNodesSources> extends JsonLdObject {
    item: T
    children: RoadizWalkerKnown<C>[]
}

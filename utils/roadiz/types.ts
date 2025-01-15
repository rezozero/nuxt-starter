import type { JsonLdObject, RoadizNodesSources } from '@roadiz/types'

export interface RoadizWalkerKnown<Item = RoadizNodesSources, Child = RoadizNodesSources> extends JsonLdObject {
    item: Item
    children: RoadizWalkerKnown<Child>[]
}

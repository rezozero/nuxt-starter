// ROADIZ
import type { RoadizNodesSources, JsonLdObject } from '@roadiz/types'

export interface RoadizWalkerKnown<T = RoadizNodesSources, C = RoadizNodesSources> extends JsonLdObject {
    item: T
    children: RoadizWalkerKnown<C>[]
}

// COMMONS
export type Writeable<T> = { -readonly [P in keyof T]: T[P] }
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never
export type ValueOf<T> = T extends any[] ? T[number] : T[keyof T]

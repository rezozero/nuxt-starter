export type Writeable<T> = { -readonly [P in keyof T]: T[P] }

export type UnionToIntersection<U> =
    (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never

export type ValueOf<T> = T extends unknown[] ? T[number] : T[keyof T]

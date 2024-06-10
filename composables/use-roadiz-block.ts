import type { RoadizNodesSources, RoadizWalker } from '@roadiz/types'

export interface UseRoadizBlockProps {
    walker: RoadizWalker
    index: number
    blocks?: RoadizWalker[]
    numBlocks?: number | string
}

export interface UseRoadizBlockOptions {
    props: UseRoadizBlockProps
}

export function useRoadizBlock<T extends RoadizNodesSources>({ props }: UseRoadizBlockOptions) {
    const walker = computed(() => props.walker)
    const item = computed<T>(() => walker.value.item as T)
    const children = computed(() => walker.value.children)
    const childrenItems = computed(() => children.value.map((walker) => walker.item))

    return { item, children, childrenItems }
}

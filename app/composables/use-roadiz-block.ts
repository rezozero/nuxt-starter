import type { JsonLdObject, RoadizNodesSources } from '@roadiz/types'
import type { UseRoadizBlockProps } from '~~/types/app'

export interface UseRoadizBlockOptions {
    props: UseRoadizBlockProps
}

export function useRoadizBlock<
    T extends RoadizNodesSources,
    C extends JsonLdObject = RoadizNodesSources,
>({ props }: UseRoadizBlockOptions) {
    const walker = computed(() => props.walker)
    const item = computed<T>(() => walker.value.item as T)
    const children = computed(() => walker.value.children)
    const childrenItems = computed(() => children.value?.map(walker => walker.item as C))

    return { item, children, childrenItems }
}

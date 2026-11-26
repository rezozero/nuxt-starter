<script lang="ts" setup generic="RawT extends JsonLdObject = RoadizNodesSources, T = RawT">
import type { ComponentPublicInstance } from 'vue'
import type { HydraCollection, JsonLdObject, RoadizNodesSources, RoadizRequestNSParams } from '@roadiz/types'
import { usePaginatedList } from '~/composables/use-paginated-list'

const props = defineProps<{
    url: string
    params?: RoadizRequestNSParams
    itemElements?: (ComponentPublicInstance | HTMLElement)[]
    // Maps each fetched item (RawT) to the item exposed in the slot (T), which also lets T be inferred
    transform?: (item: RawT) => T
}>()

const root = ref<HTMLElement | null>(null)
const { page, isScrollingToTop } = usePaginatedList({
    element: root,
})
const itemsPerPage = computed(() => props.params?.itemsPerPage || 12)
const internalParams = computed(() => ({
    ...props.params,
    page: page.value,
    itemsPerPage: itemsPerPage.value,
}))
const { itemBaseId } = useList({
    url: props.url,
    params: internalParams,
})

const { data, status } = await useRoadizFetch<HydraCollection<RawT>>(props.url, {
    params: internalParams,
    watch: [page],
    pick: ['hydra:member', 'hydra:totalItems'],
})

const items = computed<(T | null)[]>(() => {
    if (status.value === 'pending' || isScrollingToTop.value) {
        return [...Array(itemsPerPage.value).keys()].map(() => null)
    }

    const members = data.value?.['hydra:member'] || []
    const transform = props.transform

    // Without transform, T defaults to RawT
    return transform ? members.map(item => transform(item)) : members as unknown as T[]
})

const totalPages = computed(() => {
    const totalItems = data.value?.['hydra:totalItems'] || 0
    return Math.ceil(totalItems / itemsPerPage.value)
})

const hasMoreThanOnePage = computed(() => {
    return (totalPages.value > 1)
})

defineSlots<{
    'item': (props: { item: T | null, classNames: string | undefined, index: number }) => unknown
    'no-result'?: () => unknown
}>()
</script>

<template>
    <div
        ref="root"
        :class="$style.root"
    >
        <template v-if="items.length">
            <div
                :class="$style.list"
                class="grid"
            >
                <template
                    v-for="(item, index) in items"
                    :key="itemBaseId + '-' + index"
                >
                    <slot
                        name="item"
                        v-bind="{ item, classNames: $style.item, index }"
                    />
                </template>
            </div>
            <LazyVPagination
                v-if="hasMoreThanOnePage"
                v-model="page"
                :class="$style.pagination"
                :length="totalPages"
            />
        </template>
        <slot
            v-else
            name="no-result"
        />
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/mixins/include-media' as *;

.root {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.list {
    margin-bottom: 48px;
}

.item {
    grid-column: 1 / -1;

    @include media('>=md') {
        grid-column: span 6;
    }

    @include media('>=lg') {
        grid-column: span 4;
    }
}

.pagination {
    margin-bottom: 48px;
}
</style>

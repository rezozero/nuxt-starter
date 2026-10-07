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

const { data, status, error } = await useRoadizFetch<HydraCollection<RawT>>(props.url, {
    params: internalParams,
    watch: [page],
    pick: ['hydra:member', 'hydra:totalItems'],
})

// Transform items only when data changes (not when the parent re-renders with a new transform function)
const members = shallowRef<T[]>([])

watch(data, (value) => {
    const rawMembers = value?.['hydra:member'] || []

    // Without transform, T defaults to RawT
    members.value = props.transform ? rawMembers.map(props.transform) : rawMembers as unknown as T[]
}, { immediate: true })

const totalItems = computed(() => data.value?.['hydra:totalItems'] || 0)

const placeholderCount = computed(() => {
    // Don't render more placeholders than the target page can hold (e.g. last page)
    if (!totalItems.value) return itemsPerPage.value

    const remainingItems = totalItems.value - (page.value - 1) * itemsPerPage.value

    return Math.max(Math.min(itemsPerPage.value, remainingItems), 0) || itemsPerPage.value
})

const items = computed<(T | null)[]>(() => {
    if (status.value === 'pending' || isScrollingToTop.value) {
        return [...Array(placeholderCount.value).keys()].map(() => null)
    }

    return members.value
})

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

// Keep the pagination visible even if the current page is out of range, so the user can navigate back
const hasMoreThanOnePage = computed(() => !error.value && totalPages.value > 1)

defineSlots<{
    'item': (props: { item: T | null, classNames: string, index: number }) => unknown
    'no-result'?: () => unknown
    'error'?: (props: { error: NonNullable<typeof error.value> }) => unknown
}>()
</script>

<template>
    <div
        ref="root"
        :class="$style.root"
    >
        <div
            v-if="items.length"
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
        <slot
            v-else-if="error"
            name="error"
            :error="error"
        />
        <slot
            v-else
            name="no-result"
        />
        <LazyVPagination
            v-if="hasMoreThanOnePage"
            v-model="page"
            :class="$style.pagination"
            :length="totalPages"
        />
    </div>
</template>

<style lang="scss" module>
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

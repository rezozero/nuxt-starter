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

const isPending = computed(() => status.value === 'pending' || isScrollingToTop.value)

const items = computed<(T | null)[]>(() => {
    if (isPending.value) {
        return [...Array(placeholderCount.value).keys()].map(() => null)
    }

    return members.value
})

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

// Keep the pagination visible even if the current page is out of range, so the user can navigate back
const hasMoreThanOnePage = computed(() => !error.value && totalPages.value > 1)

// Move the focus to the top of the list once the new page is loaded,
// so keyboard and screen reader users do not stay on the pagination
watch(page, async () => {
    await until(isPending).toBe(false)
    root.value?.focus({ preventScroll: true })
})

const { t } = useI18n()
const statusMessage = computed(() => {
    if (isPending.value) return t('paginated_list.loading')
    if (error.value || !totalPages.value) return ''

    return t('paginated_list.page_%page%_of_%total%', { page: page.value, total: totalPages.value })
})

defineSlots<{
    'item': (props: { item: T | null, index: number }) => unknown
    'no-result'?: () => unknown
    'error'?: (props: { error: NonNullable<typeof error.value> }) => unknown
}>()
</script>

<template>
    <div
        ref="root"
        :class="$style.root"
        tabindex="-1"
    >
        <p
            class="visually-hidden"
            role="status"
            aria-atomic="true"
            aria-live="polite"
        >
            {{ statusMessage }}
        </p>
        <ul
            v-if="items.length"
            :class="$style.list"
            class="grid"
            :aria-busy="isPending"
        >
            <li
                v-for="(item, index) in items"
                :key="itemBaseId + '-' + index"
                :class="$style.item"
            >
                <slot
                    name="item"
                    v-bind="{ item, index }"
                />
            </li>
        </ul>
        <div
            v-else-if="error"
            role="alert"
        >
            <slot
                name="error"
                :error="error"
            />
        </div>
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

    // Focus is moved programmatically on page change, no need for a visible outline on the whole list
    &:focus {
        outline: none;
    }
}

.list {
    padding: 0;
    margin: 0 0 48px;
    list-style: none;
    row-gap: 24px;
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
    margin-block: 48px;
}
</style>

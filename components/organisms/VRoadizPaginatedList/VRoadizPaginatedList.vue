<script generic="T extends JsonLdObject" lang="ts" setup>
import type { ComponentPublicInstance, PropType } from 'vue'
import type { HydraCollection, JsonLdObject, RoadizRequestNSParams } from '@roadiz/types'
import { usePaginatedList } from '~/composables/use-paginated-list'

const props = defineProps({
    url: {
        type: String,
        required: true,
    },
    params: Object as PropType<RoadizRequestNSParams>,
    itemElements: Array as PropType<(ComponentPublicInstance | HTMLElement)[]>,
    generatePlaceholder: Function as PropType<(i: number) => T>,
})

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

const { data, status } = await useRoadizFetch<HydraCollection<T>>(props.url, {
    params: internalParams,
    watch: [page],
})

const items = computed(() => {
    if (status.value === 'pending' || isScrollingToTop.value) {
        return [...Array(itemsPerPage.value).keys()].map((i: number) => {
            return props.generatePlaceholder?.(i) || null
        })
    }

    return data.value?.['hydra:member'] || []
})

const totalPages = computed(() => {
    const totalItems = data.value?.['hydra:totalItems'] || 0
    return Math.ceil(totalItems / itemsPerPage.value)
})

const hasMoreThanOnePage = computed(() => {
    return (totalPages.value > itemsPerPage.value) || (page.value > 1)
})

defineSlots<{
    'item': (props: { item: T | null, classNames: string, index: number }) => unknown
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
.root {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.list {
    margin-bottom: rem(48);
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
    margin-bottom: rem(48);
}
</style>

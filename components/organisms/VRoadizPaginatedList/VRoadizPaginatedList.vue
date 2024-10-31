<script lang="ts" setup>
import type { ComponentPublicInstance, PropType } from 'vue'
import type { HydraCollection, RoadizNodesSources, RoadizRequestNSParams } from '@roadiz/types'
import { usePaginatedList } from '~/composables/use-paginated-list'

const props = defineProps({
    url: {
        type: String,
        required: true,
    },
    params: Object as PropType<RoadizRequestNSParams>,
    itemElements: Array as PropType<(ComponentPublicInstance | HTMLElement)[]>,
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
const { data, status } = await useRoadizFetch<HydraCollection<RoadizNodesSources>>(props.url, {
    params: internalParams,
    watch: [page],
})
const items = computed(() => {
    if (status.value === 'pending' || isScrollingToTop.value) {
        return Array.from({ length: itemsPerPage.value }).map(() => null)
    }

    return data.value?.['hydra:member'] || []
})
const pageLength = computed(() => {
    const totalItems = data.value?.['hydra:totalItems'] || 0
    return Math.ceil(totalItems / itemsPerPage.value)
})
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
            <VPagination
                v-model="page"
                :class="$style.pagination"
                :length="pageLength"
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

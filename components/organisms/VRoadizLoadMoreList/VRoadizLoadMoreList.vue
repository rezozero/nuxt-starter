<script lang="ts" setup>
import type { ComponentPublicInstance, PropType } from 'vue'
import type { RoadizNodesSources, RoadizRequestNSParams } from '@roadiz/types'

const props = defineProps({
    url: {
        type: String,
        required: true,
    },
    params: Object as PropType<RoadizRequestNSParams>,
    itemElements: Array as PropType<(ComponentPublicInstance | HTMLElement)[]>,
})

const list = ref<HTMLElement | undefined>()

const internalParams = computed(() => ({
    ...props.params,
}))

const { items, hasMoreItems, isPending } = await useRoadizLoadMore<RoadizNodesSources>({
    url: props.url,
    element: list,
    params: internalParams,
})

const { itemBaseId } = useList({
    url: props.url,
    params: internalParams,
})
</script>

<template>
    <div :class="$style.root">
        <template v-if="items.length">
            <div
                ref="list"
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
            <VLoadMoreButton
                v-if="hasMoreItems"
                :pending="isPending"
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

.item {
    grid-column: 1 / -1;

    @include media('>=md') {
        grid-column: span 6;
    }

    @include media('>=lg') {
        grid-column: span 4;
    }
}
</style>

<script lang="ts" setup generic="RawT extends JsonLdObject = RoadizNodesSources, T = RawT">
import type { ComponentPublicInstance } from 'vue'
import type { JsonLdObject, RoadizNodesSources, RoadizRequestNSParams } from '@roadiz/types'

const props = defineProps<{
    url: string
    params?: RoadizRequestNSParams
    itemElements?: (ComponentPublicInstance | HTMLElement)[]
    // Maps each fetched item (RawT) to the item exposed in the slot (T), which also lets T be inferred
    transform?: (item: RawT) => T
}>()

const list = ref<HTMLElement | undefined>()

const internalParams = computed(() => ({
    ...props.params,
}))

const { items: rawItems, hasMoreItems, isPending } = await useRoadizLoadMore<RawT>({
    url: props.url,
    element: list,
    params: internalParams,
})

const { itemBaseId } = useList({
    url: props.url,
    params: internalParams,
})

const items = computed<(T | null)[]>(() => {
    const transform = props.transform

    // Without transform, T defaults to RawT
    if (!transform) return rawItems.value as unknown as (T | null)[]

    return rawItems.value.map(item => item && transform(item))
})

defineSlots<{
    'item': (props: { item: T | null, classNames: string | undefined, index: number }) => unknown
    'no-result'?: () => unknown
}>()
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

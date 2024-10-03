<script lang="ts" setup>
import type { ComponentPublicInstance, PropType } from 'vue'
import type { RoadizNodesSources, RoadizRequestNSParams } from '@roadiz/types'
import { generateHashFromObject } from '~/utils/string/generate-hash-from-object'
import { slugify } from '~/utils/string/slugify'

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

const { items, page, loadPage, hasMoreItems, isPending } = useRoadizLoadMore<RoadizNodesSources>({
    url: props.url,
    element: list,
    params: internalParams,
})

const itemBaseId = computed(() => {
    return slugify(props.url) + '-' + generateHashFromObject(internalParams.value)
})

if (import.meta.server) {
    // On server side, we need to load the current page before to render the component.
    await loadPage(page.value)
}
else {
    // On client side, we need to lazy load the current page AND display the skeleton immediately.
    loadPage(page.value)
}
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

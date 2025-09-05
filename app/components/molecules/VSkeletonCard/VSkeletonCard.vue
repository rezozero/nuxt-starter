<script lang="ts" setup>
import type { SlotClass, SlotName, Props as VCardSlot } from '~/components/molecules/VCard/VCard.vue'

const {
    elements = ['overtitle', 'title', 'content', 'image', 'cta'],
    ui,
} = defineProps<VCardSlot & {
    elements?: SlotName[]
    enabled: boolean
}>()

const $style = useCssModule()

const getFlatArray = (list: SlotClass) => Array.isArray(list) ? list : [list]
const uiProps = computed(() => {
    return elements.reduce((acc, name) => {
        acc[name] = [$style[name], ...getFlatArray(ui?.[name])]
        return acc
    }, {} as Record<SlotName, SlotClass>)
})
</script>

<template>
    <VCard
        v-bind="$props"
        :ui="uiProps"
        :class="[$style.card, enabled && $style['root--skeleton-enabled']]"
    >
        <template
            v-for="slotName in elements"
            #[slotName]="{ itemClass }"
            :key="slotName"
        >
            <slot
                :name="slotName"
                :item-class="itemClass"
            >
                <div
                    v-if="enabled"
                    :class="itemClass"
                />
            </slot>
        </template>
    </VCard>
</template>

<style lang="scss" module>
@use 'assets/scss/mixins/loading-animation' as *;

.root {
    &--skeleton-enabled {
        --loading-animation-background-color: #F5F5F5;
    }
}

.overtitle {
    .root--skeleton-enabled & {
        min-height: 20px;

        @include loading-animation-text-placeholder;
    }
}

.title {
    .root--skeleton-enabled & {
        min-height: 20px;

        @include loading-animation-text-placeholder;
    }
}

.content {
    .root--skeleton-enabled & {
        min-height: 60px;

        @include loading-animation;
    }
}

.image {
    aspect-ratio: var(--v-skeleton-card-image-aspect-ratio, 4 / 3);
    width: 100%;

    .root--skeleton-enabled & {
        @include loading-animation;
    }
}

.cta {
    .root--skeleton-enabled & {
        min-height: 20px;

        @include loading-animation;
    }
}
</style>

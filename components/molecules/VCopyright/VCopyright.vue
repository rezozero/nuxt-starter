<script setup lang="ts">
import type { PropType } from 'vue'
import type { Placement, Tooltip } from 'floating-vue'

import { hash } from 'ohash'

const props = defineProps({
    placement: {
        type: String as PropType<Placement>,
        default: 'top-end',
    },
    content: String,
    container: {
        type: String,
        default: 'body',
    },
})

// Workaround for https://github.com/Akryum/floating-vue/issues/1006
const id = computed(() => hash(props.content))

const tooltipProps = computed(() => {
    return {
        distance: '0',
        skidding: '-8',
        placement: props.placement,
        triggers: ['hover', 'focus', 'click'],
        container: props.container,
        delay: { show: 0, hide: 100 },
        ariaId: id.value,
        handleResize: true,
        eagerMount: true,
    }
})

const displayedComponent = shallowRef<string | typeof Tooltip>('div')
const isTooltipComponentDisplayed = computed(() => displayedComponent.value !== 'div')

async function onUserInteract() {
    if (isTooltipComponentDisplayed.value) return

    import('assets/scss/vendors/_floating-vue.scss')
    displayedComponent.value = (await import('floating-vue')).Tooltip
}
</script>

<template>
    <component
        :is="displayedComponent"
        :class="$style.root"
        v-bind="isTooltipComponentDisplayed ? tooltipProps : undefined"
        @mouseover="onUserInteract"
        @click="onUserInteract"
    >
        <VCopyrightButton />
        <template #popper>
            <slot>
                <VMarkdown
                    :class="$style.content"
                    :content="content"
                />
            </slot>
        </template>
    </component>
</template>

<style lang="scss" module>
.root {
    position: absolute;
    right: var(--v-copyright-right, 0);
    bottom: var(--v-copyright-bottom, 0);
}

.content {
    max-width: rem(276);

    p {
        padding: 0;
    }
}
</style>

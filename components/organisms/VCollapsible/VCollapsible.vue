<script lang="ts">
import type { Component } from 'vue'

export type VCollaspsibleProps = {
    rootElement?: Component | string
    id?: string
    label?: string
    collapsed?: boolean
    elementClass?: {
        control?: string
        icon?: string
        content?: string
    }
}
</script>

<script lang="ts" setup>
const props = defineProps<VCollaspsibleProps>()

const slots = useSlots()
const hasContent = computed(() => !!slots.default)

const isCollapsed = ref(props.collapsed)
function toggle() {
    isCollapsed.value = !isCollapsed.value
}

const contentId = computed(() => {
    return 'accordion-' + (props.id || useId())
})
</script>

<template>
    <component
        :is="rootElement || 'div'"
    >
        <slot
            name="control"
            :is-collapsed="isCollapsed"
            :aria-control="contentId"
            :disabled="!hasContent"
            :toggle="toggle"
        >
            <VButton
                :aria-expanded="!isCollapsed"
                :aria-controls="contentId"
                :disabled="!hasContent"
                :class="[$style.control, elementClass?.control]"
                :icon-name="isCollapsed ? 'PlusMD' : 'MinusMD'"
                :icon-class="elementClass?.icon"
                :label="label || (isCollapsed ? $t('open') : $t('close'))"
                @click="toggle"
            />
        </slot>

        <VTransitionExpand>
            <div
                v-show="!isCollapsed"
                :id="contentId"
                :class="[$style.content, elementClass?.content]"
            >
                <slot />
            </div>
        </VTransitionExpand>
    </component>
</template>

<style lang="scss" module>
.control {
    cursor: pointer;
}

.content {
    max-width: var(--v-collasible-content-max-width, initial);
}
</style>

<script lang="ts" setup>
const props = defineProps<{
    label?: string
    collapsed?: boolean
    buttonClass?: string
    iconClass?: string
    contentClass?: string
}>()

const slots = useSlots()
const hasContent = computed(() => !!slots.default)

const isCollapsed = ref(props.collapsed)
function toggle() {
    isCollapsed.value = !isCollapsed.value
}

const contentId = `collapsible-${useId()}`
</script>

<template>
    <slot
        name="button"
        :is-collapsed="isCollapsed"
        :aria-controls="contentId"
        :disabled="!hasContent"
        :toggle="toggle"
    >
        <VButton
            :aria-expanded="!isCollapsed"
            :aria-controls="contentId"
            :disabled="!hasContent"
            :class="[$style.button, buttonClass]"
            :icon-name="isCollapsed ? 'PlusMD' : 'MinusMD'"
            :icon-class="iconClass"
            :label="label || (isCollapsed ? $t('open') : $t('close'))"
            @click="toggle"
        />
    </slot>

    <VTransitionExpand>
        <div
            v-show="!isCollapsed"
            :id="contentId"
            :class="[$style.content, contentClass]"
        >
            <slot />
        </div>
    </VTransitionExpand>
</template>

<style lang="scss" module>
.button {
    cursor: pointer;
}

.content {
    max-width: var(--v-collapsible-content-max-width, initial);
}
</style>

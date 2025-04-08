<script lang="ts" setup="">
const props = defineProps({
    label: String,
    collapsed: Boolean,
})

const slots = useSlots()
const hasContent = computed(() => !!slots.default)
const isCollapsible = computed(() => hasContent.value)
const isCollapsed = ref(props.collapsed)

function toggle() {
    isCollapsed.value = !isCollapsed.value
}
</script>

<template>
    <div :class="[$style.root, isCollapsed && $style['root--collapsed'], isCollapsible && $style['root--collapsible']]">
        <div
            :class="$style.label"
            @click="toggle"
        >
            <slot
                name="label"
                :is-collapsed="isCollapsed"
            >
                {{ label }}
            </slot>
            <slot
                name="cta"
                :is-collapsed="isCollapsed"
            >
                <VButton v-if="isCollapsible">
                    {{ isCollapsed ? '+' : '-' }}
                </VButton>
            </slot>
        </div>
        <VTransitionExpand>
            <div
                v-show="!isCollapsed"
                :class="$style.content"
            >
                <slot />
            </div>
        </VTransitionExpand>
    </div>
</template>

<style lang="scss" module>
.label {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .root--collapsible & {
        cursor: pointer;
    }
}
</style>

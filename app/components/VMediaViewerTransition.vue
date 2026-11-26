<script lang="ts" setup>
const { isOpen } = useMediaViewer()
const { isPageScrollLocked } = usePageScrollLock({ withPaddingRight: true })

watch(
    isOpen,
    (isOpen) => {
        isPageScrollLocked.value = isOpen
    },
    { immediate: true },
)
</script>

<template>
    <Transition :name="$style['root']">
        <LazyVMediaViewer v-if="isOpen" />
    </Transition>
</template>

<style lang="scss" module>
.root {
    &:global(#{'-enter-active'}),
    &:global(#{'-leave-active'}) {
        transition-duration: 0.3s, 0.5s;
        transition-property: opacity, scale;
        transition-timing-function: ease(out-quad), ease(out-quart);
    }

    &:global(#{'-enter-from'}),
    &:global(#{'-leave-to'}) {
        opacity: 0;
        scale: 0.98;
    }
}
</style>

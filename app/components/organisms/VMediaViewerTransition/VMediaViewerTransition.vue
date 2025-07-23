<script lang="ts" setup>
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { getHtmlElement, type TemplateElement } from '~/utils/ref/get-html-element'

const mediaViewerInstance = ref<TemplateElement>(null)
const mediaViewer = ref<HTMLElement | null>(null)
const { isOpen } = useMediaViewer()

const unwatch = watch(mediaViewerInstance, (componentInstance) => {
    if (!componentInstance || mediaViewer.value) return

    mediaViewer.value = getHtmlElement(componentInstance) as HTMLElement

    // During first time apparition, element is set after isOpen watch method callback
    if (isOpen.value) disableScroll()
    unwatch()
})

watch(
    isOpen,
    (isOpen) => {
        if (isOpen) disableScroll()
        else enabledScroll()
    },
    { flush: 'post' },
)

function disableScroll() {
    if (mediaViewer.value) disableBodyScroll(mediaViewer.value, { reserveScrollBarGap: true })
}

function enabledScroll() {
    if (mediaViewer.value) enableBodyScroll(mediaViewer.value)
    else clearAllBodyScrollLocks()
}
</script>

<template>
    <Transition
        :name="$style['root']"
        @after-leave="enabledScroll"
    >
        <LazyVMediaViewer
            v-if="isOpen"
            ref="mediaViewerInstance"
        />
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

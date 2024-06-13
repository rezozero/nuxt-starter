<script lang="ts" setup>
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import type { ComponentPublicInstance, MaybeRef } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'
import { ease } from '~/utils/ease'
import { isSafari } from '~/utils/browser/is-safari'
import { getHtmlElement } from '~/utils/ref/get-html-element'
import { reflow } from '~/utils/dom/reflow'

export type VModalAlign =
    | 'top-left'
    | 'top'
    | 'top-right'
    | 'right'
    | 'bottom-right'
    | 'bottom'
    | 'bottom-left'
    | 'left'

interface VModalProps {
    align?: VModalAlign
    scrollableElement?: MaybeRef<HTMLElement | ComponentPublicInstance | null | undefined>
}

const props = defineProps<VModalProps>()
const isOpen = defineModel<boolean>()
const emits = defineEmits(['enter', 'after-enter', 'leave', 'after-leave'])

const root = ref<HTMLDialogElement | null>(null)

let animations: Animation[] = []

const close = () => (isOpen.value = false)

function animationsFinished() {
    return Promise.all(animations.map(animation => animation.finished))
}

function cancelAnimations() {
    if (!animations?.length) return

    animations.forEach(animation => animation.pause())
}

function disableScroll() {
    const element = getHtmlElement(toValue(props.scrollableElement) || root.value)
    element && disableBodyScroll(element, { reserveScrollBarGap: true })
}

function enableScroll() {
    const element = getHtmlElement(toValue(props.scrollableElement) || root.value)
    if (element) enableBodyScroll(element)
    else clearAllBodyScrollLocks()
}

function initKeyUpListener() {
    window.addEventListener('keydown', onKeyDown)
}

function disposeKeyUpListener() {
    window.removeEventListener('keydown', onKeyDown)
}

function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && !event.defaultPrevented) {
        event.preventDefault()
        close()
    }
}

// Animations
const preferredMotion = usePreferredReducedMotion()
const prefersReducedMotion = computed(() => preferredMotion.value === 'reduce')

// Animation: In
function enter() {
    const scrollY = window.scrollY

    root.value?.showModal()
    disableScroll()
    cancelAnimations()
    initKeyUpListener()

    if (isSafari() && root.value) {
        reflow(root.value) // Safari needs a reflow for the dialog to be displayed correctly
    }

    nextTick(() => {
        window.scrollTo(0, scrollY)
    })

    if (prefersReducedMotion.value) {
        afterEnter()
        return
    }

    emits('enter')
    animations = []

    animateIn()

    animationsFinished().then(afterEnter)
}

function animateIn() {
    let contentFromX = 0
    let contentFromY = 0
    let contentFromOpacity = 1

    if (mediaIsLessThan('md')) {
        contentFromY = 100
    }
    else if (props.align === 'left') {
        contentFromX = -100
    }
    else if (props.align === 'right') {
        contentFromX = 100
    }
    else if (props.align === 'top-left' || props.align === 'top-right' || props.align === 'top') {
        contentFromY = -100
    }
    else if (props.align === 'bottom' || props.align === 'bottom-left' || props.align === 'bottom-right') {
        contentFromY = 100
    }
    else {
        contentFromOpacity = 0
    }

    if (contentFromX || contentFromY) {
        const element = root.value as HTMLElement
        const animation = element.animate(
            [{ transform: `translate3d(${contentFromX}%,${contentFromY}%,0)` }, { transform: 'translate3d(0,0,0)' }],
            {
                duration: 1000,
                easing: ease('in-out-quart'),
                fill: 'forwards',
            },
        )

        // Sometimes the animation is janky on Safari iOS (with mobile layout, I guess it's because the fixed position)
        // As a workaround, I will force repaint during animation
        if (isSafari() && mediaIsLessThan('md')) {
            let rafId = -1

            function onUpdate() {
                // force repaint
                element.style.visibility = 'hidden'
                element.style.visibility = ''

                rafId = requestAnimationFrame(onUpdate)
            }

            rafId = requestAnimationFrame(onUpdate)

            animation.finished.then(() => cancelAnimationFrame(rafId))
        }

        animations.push(animation)
    }

    animations.push(
        root.value!.animate([{ opacity: contentFromOpacity }, { opacity: 1 }], {
            duration: 300,
            easing: 'linear',
            fill: 'forwards',
        }),
    )
}

function afterEnter() {
    animations = []
    emits('after-enter')
}

// Animation: Out
function leave() {
    cancelAnimations()
    disposeKeyUpListener()
    emits('leave')

    if (prefersReducedMotion.value) {
        afterLeave()
        return
    }

    animations = []
    animateOut()
    animationsFinished().then(afterLeave)
}

function animateOut() {
    let contentToX = 0
    let contentToY = 0
    let contentToOpacity = 1

    if (mediaIsLessThan('md')) {
        contentToY = 100
    }
    else if (props.align === 'left') {
        contentToX = -100
    }
    else if (props.align === 'right') {
        contentToX = 100
    }
    else if (props.align === 'top-left' || props.align === 'top-right' || props.align === 'top') {
        contentToY = -100
    }
    else if (props.align === 'bottom' || props.align === 'bottom-left' || props.align === 'bottom-right') {
        contentToY = 100
    }
    else {
        contentToOpacity = 0
    }

    if (root.value) root.value.style.visibility = 'inherit'

    if (contentToX || contentToY) {
        animations.push(
            root.value!.animate(
                {
                    transform: `translate3d(${contentToX}%,${contentToY}%,0)`,
                },
                {
                    duration: 800,
                    easing: ease('in-out-quart'),
                    fill: 'forwards',
                },
            ),
        )
    }

    animations.push(
        root.value!.animate(
            {
                opacity: contentToOpacity,
            },
            {
                duration: 200,
                easing: 'linear',
                fill: 'forwards',
            },
        ),
    )

    Promise.all(animations.map(animation => animation.finished)).then(() => {
        if (root.value) root.value!.style.visibility = ''
    })
}

function afterLeave() {
    animations = []

    root.value?.close()
    enableScroll()
    emits('after-leave')
}

watch(isOpen, (value) => {
    if (value) enter()
    else leave()
})

onMounted(() => {
    if (isOpen.value) enter()
})

onBeforeUnmount(() => {
    disposeKeyUpListener()
})

const $style = useCssModule()
const rootClass = computed(() => {
    return [$style.root, isOpen.value && $style['root--open'], props.align && $style['root--align-' + props.align]]
})

function onClick(event: MouseEvent) {
    if (!root.value) return

    const rect = root.value.getBoundingClientRect()

    // The <dialog> backdrop pseudo-element is not clickable, so we need to close the modal when clicking outside.
    if (
        event.clientY < rect.top
        || event.clientY > rect.bottom
        || event.clientX < rect.left
        || event.clientX > rect.right
    ) {
        close()
    }
}
</script>

<template>
    <dialog
        ref="root"
        :class="rootClass"
        :inert="!isOpen"
        @click="onClick"
    >
        <slot name="close">
            <VButton
                :class="$style.close"
                icon-name="cross"
                theme="light"
                @click="close"
            />
        </slot>
        <slot />
    </dialog>
</template>

<style lang="scss" module>
$offset: var(--v-modal-offset, 0);

.root {
    position: relative;
    z-index: 2001;
    width: var(--v-modal-width, 100%);
    background-color: color(white);
    -webkit-overflow-scrolling: touch;
    overflow-y: auto;
    pointer-events: none;
    scroll-behavior: smooth;
    touch-action: pan-y;

    @include media('<md') {
        // Fixed bottom modal on mobile
        position: fixed;
        max-height: 100svh;
        inset: auto 0 0;
    }

    @include media('>=md') {
        max-height: 100vh;

        &[class*='--align-'] {
            position: fixed;
        }

        &--align-left,
        &--align-top-left,
        &--align-top {
            top: $offset;
            left: $offset;
        }

        &--align-top-right,
        &--align-right {
            top: $offset;
            right: $offset;
        }

        &--align-bottom-right {
            right: $offset;
            bottom: $offset;
        }

        &--align-bottom,
        &--align-bottom-left {
            bottom: $offset;
            left: $offset;
        }
    }

    &::backdrop {
        background-color: rgba(color(black), 0.7);
        opacity: 0;
        transition:
            opacity 0.3s,
            visibility 0s 0.3s;
        visibility: hidden;
    }

    &--open {
        pointer-events: auto;

        &::backdrop {
            opacity: 1;
            transition-delay: 0s;
            visibility: inherit;
        }
    }
}

.close {
    position: absolute;
    z-index: 10;
    top: var(--v-modal-close-top, 10px);
    right: var(--v-modal-close-right, 10px);
    width: 48px;
    height: 48px;
    border-radius: 100vmax;
    background-color: color(white);
    pointer-events: all;

    @include media('<md') {
        --v-button-display: flex;
    }

    @include media('>=md') {
        display: var(--v-modal-close-display, flex);
    }
}
</style>

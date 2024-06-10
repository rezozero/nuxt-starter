<script setup lang="ts">
// @see https://markus.oberlehner.net/blog/transition-to-height-auto-with-vue/

function callDoneCallback(element: Element, done: () => void) {
    const animation = element
        .getAnimations()
        .filter((animation) => (animation as CSSTransition).transitionProperty === 'height')[0]

    if (animation) animation.finished.then(done)
    else done()
}

function onEnter(element: Element, done: () => void) {
    ;(element as HTMLElement).style.width = getComputedStyle(element).width
    ;(element as HTMLElement).style.position = 'absolute'
    ;(element as HTMLElement).style.visibility = 'hidden'
    ;(element as HTMLElement).style.height = 'auto'

    const height = getComputedStyle(element).height

    ;(element as HTMLElement).style.width = ''
    ;(element as HTMLElement).style.position = ''
    ;(element as HTMLElement).style.visibility = ''
    ;(element as HTMLElement).style.height = '0'

    // Force repaint to make sure the
    // animation is triggered correctly.
    // eslint-disable-next-line no-unused-expressions
    getComputedStyle(element).height

    requestAnimationFrame(() => {
        ;(element as HTMLElement).style.height = height

        callDoneCallback(element, done)
    })
}

function onAfterEnter(element: Element) {
    ;(element as HTMLElement).style.height = 'auto'
}

function onLeave(element: Element, done: () => void) {
    ;(element as HTMLElement).style.height = getComputedStyle(element).height

    // Force repaint to make sure the
    // animation is triggered correctly.
    // eslint-disable-next-line no-unused-expressions
    getComputedStyle(element).height

    requestAnimationFrame(() => {
        ;(element as HTMLElement).style.height = '0'

        callDoneCallback(element, done)
    })
}
</script>

<template>
    <Transition name="expand" @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave">
        <!-- eslint-disable-next-line vue/require-toggle-inside-transition -->
        <slot />
    </Transition>
</template>

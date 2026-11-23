import type { WritableComputedRef } from 'vue'
import { tryOnScopeDispose } from '@vueuse/core'

export interface PageScrollLockOptions {
    // Replaces the disappearing scrollbar with an equal `padding-right` on the root,
    // for projects without a permanent `scrollbar-gutter: stable` on it.
    // Fixed elements ignore that padding: offset them with `--page-scroll-lock-gap`.
    withPaddingRight?: boolean
}

// Shared by every caller: a popover may open from an already locked panel,
// and the first one to close must not unlock the page under the other.
let lockCount = 0
let restoreRootStyle: (() => void) | undefined

function acquireLock(options: PageScrollLockOptions) {
    if (lockCount++ > 0) return

    const root = document.documentElement
    const { overflow, paddingRight } = root.style

    if (options.withPaddingRight) {
        const style = getComputedStyle(root)
        // A gutter already holds the place of the scrollbar: padding it would double the gap.
        // Safari < 18.2 lacks the property (undefined): no gutter, so fall back to the gap
        const gap = style.scrollbarGutter?.includes('stable') ? 0 : window.innerWidth - root.clientWidth

        if (gap > 0) {
            root.style.paddingRight = `${Number.parseFloat(style.paddingRight) + gap}px`
            root.style.setProperty('--page-scroll-lock-gap', `${gap}px`)
        }
    }

    // On the root rather than <body>: it is the element that scrolls, and iOS
    // Safari (16+) honors it without any touchmove listener.
    root.style.overflow = 'hidden'

    restoreRootStyle = () => {
        root.style.overflow = overflow
        root.style.paddingRight = paddingRight
        root.style.removeProperty('--page-scroll-lock-gap')
    }
}

function releaseLock() {
    if (lockCount === 0 || --lockCount > 0) return

    restoreRootStyle?.()
    restoreRootStyle = undefined
}

/**
 * Prevents the page from scrolling under an open panel (dialog, menu…).
 * Each instance holds at most one lock, released when its scope is disposed.
 * `isPageScrollLocked` reflects this instance's lock, and sets it when written.
 * The lock is shared: only the options of the instance that takes it first apply.
 */
export function usePageScrollLock(options: PageScrollLockOptions = {}): {
    isPageScrollLocked: WritableComputedRef<boolean>
    lockPageScroll: () => void
    unlockPageScroll: () => void
} {
    const isLocked = shallowRef(false)

    function lockPageScroll() {
        if (isLocked.value || import.meta.server) return

        isLocked.value = true
        acquireLock(options)
    }

    function unlockPageScroll() {
        if (!isLocked.value) return

        isLocked.value = false
        releaseLock()
    }

    const isPageScrollLocked = computed({
        get: () => isLocked.value,
        set: value => value ? lockPageScroll() : unlockPageScroll(),
    })

    tryOnScopeDispose(unlockPageScroll)

    return { isPageScrollLocked, lockPageScroll, unlockPageScroll }
}

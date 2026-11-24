import type { Ref } from 'vue'

type PresentationMode = 'inline' | 'fullscreen'

/**
 * Fullscreen for a YouTube or Vimeo player on iPhone, where Safari has no Fullscreen API:
 * only a <video> goes fullscreen there, and an <iframe> never can. The player container fills
 * the viewport instead, in the top layer so that no ancestor (transform, stacking context) clips it.
 *
 * Video.js (10.2.0) falls back to the media's `webkitSetPresentationMode()` when the document
 * cannot go fullscreen: `install()` gives the embed media element that API, so the Video.js
 * fullscreen button, its label and the `f` hotkey drive this mode as they would a native one.
 */
export function useFallbackFullscreen(container: Readonly<Ref<HTMLElement | null | undefined>>) {
    const isFallbackFullscreen = shallowRef(false)
    const isPageScrollLocked = useScrollLock(import.meta.client ? document.documentElement : null)

    let media: HTMLElement | undefined

    function setFallbackFullscreen(value: boolean) {
        const element = container.value
        if (!element || value === isFallbackFullscreen.value) return

        isFallbackFullscreen.value = value
        isPageScrollLocked.value = value

        // Without the popover API (iOS < 17), the `position: fixed` of the class alone
        if ('showPopover' in element) {
            if (value) {
                element.popover = 'manual'
                element.showPopover()
            }
            else {
                if (element.matches(':popover-open')) element.hidePopover()
                element.removeAttribute('popover')
            }
        }

        // Video.js reads the state again on this event, as on a native fullscreen change
        media?.dispatchEvent(new Event('fullscreenchange', { bubbles: true }))
    }

    function install(element: HTMLElement) {
        const doc = document as Document & { webkitFullscreenEnabled?: boolean }
        if (doc.fullscreenEnabled || doc.webkitFullscreenEnabled) return

        media = element
        Object.defineProperties(element, {
            webkitPresentationMode: {
                configurable: true,
                get: (): PresentationMode => isFallbackFullscreen.value ? 'fullscreen' : 'inline',
            },
            webkitSetPresentationMode: {
                configurable: true,
                value: (mode: PresentationMode) => setFallbackFullscreen(mode === 'fullscreen'),
            },
        })
    }

    // A native fullscreen leaves on Escape: a keyboard paired with the iPhone gets the same
    useEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isFallbackFullscreen.value) setFallbackFullscreen(false)
    })

    return { isFallbackFullscreen, install }
}

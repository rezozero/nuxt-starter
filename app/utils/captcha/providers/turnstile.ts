import captchaFieldKey from '~/utils/captcha/providers.constants'
import { injectScript } from '../utils/inject-script'
import { defineCaptchaProvider } from './defineCaptchaProvider'

// TYPES
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/cloudflare-turnstile/index.d.ts
interface RenderParameters {
    sitekey: string
    action?: string | undefined
    cData?: string | undefined
    theme?: 'auto' | 'light' | 'dark'
    size?: 'normal' | 'compact' | 'invisible' | undefined
    appearance?: 'always' | 'execute' | 'interaction-only' | undefined
    execution?: 'render' | 'execute' | undefined
}

declare global {
    interface Window {
        // https://github.com/FriendlyCaptcha/friendly-captcha-sdk/blob/main/src/sdk/sdk.ts
        turnstile?: {
            render(container: string | HTMLElement, params?: RenderParameters): string | null | undefined
            execute(container: string | HTMLElement, params?: RenderParameters): void
            remove(container?: string | HTMLElement): void
            reset(container?: string | HTMLElement): void
        }
    }
}

export default defineCaptchaProvider({
    name: 'turnstile',
    inputAttributes: {
        key: captchaFieldKey.TURNSTILE,
        class: 'cf-turnstile',
    },
    needUserConsent: false,
    scripts: [
        {
            // `render=explicit` disables Cloudflare's implicit auto-render (it scans the DOM for
            // `.cf-turnstile` elements on script load) so our own `render()` below is what actually
            // renders the widget and captures its `widgetId` — required for `reset()`/`remove()` to
            // target the right widget instead of being a no-op.
            src: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
            id: 'script-cf-turnstile',
            async: true,
            defer: true,
        },
    ],
    // Overrides the default loadScript: the shared factory only calls `render()` when the script was
    // already loaded (reused instance), not on first load — implicit rendering used to cover that case.
    loadScript: async function () {
        if (!this.scriptsLoaded) {
            try {
                await Promise.all(this.scripts.map(injectScript))
                this.scriptsLoaded = true
            }
            catch (error) {
                console.error(`Error during ${this.name} scripts loading`, error)
                return
            }
        }

        this.render?.()
    },
    render: function () {
        const id = this.inputAttributes.id || ''

        this.widgetId = window?.turnstile?.render(`#${id}`)
    },
    remove: function () {
        window.turnstile?.remove(this.widgetId ?? undefined)
    },
    execute: async function (token) {
        return token
    },
    // A Turnstile token is single-use: without this, a resubmit after a failed
    // submit (server error, other field invalid, etc.) sends back the already
    // consumed/expired token and fails with a captcha-specific error. Since the
    // widget is rendered (not `execution: 'execute'`), resetting it re-triggers
    // the challenge and produces a fresh token automatically.
    reset: function () {
        if (!this.widgetId) return

        window.turnstile?.reset(this.widgetId)
    },
})

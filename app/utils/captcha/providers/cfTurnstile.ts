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
        }
    }
}

export const CF_TURNSTILE_INPUT = 'cf-turnstile-response'

export default defineCaptchaProvider({
    name: 'cfTurnstile',
    inputAttributes: {
        key: CF_TURNSTILE_INPUT,
        class: 'cf-turnstile',
    },
    needUserConsent: true,
    scripts: [
        {
            src: 'https://challenges.cloudflare.com/turnstile/v0/api.js',
            id: 'script-cf-turnstile',
            async: true,
            defer: true,
        },
    ],
    render: function () {
        const id = this.inputAttributes.id || ''

        window?.turnstile?.render(`#${id}`)
    },
    remove: function () {
        window.turnstile?.remove()
    },
    execute: async function (token) {
        return token
    },
})

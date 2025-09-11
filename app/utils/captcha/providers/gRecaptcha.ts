import { defineCaptchaProvider } from './defineCaptchaProvider'

export declare interface IRenderParameters {
    sitekey: string
    theme?: 'light' | 'dark'
    badge?: 'bottomright' | 'bottomleft' | 'inline'
    size?: 'invisible' | 'compact' | 'normal'
    tabindex?: number
}

export interface IReCaptchaInstance {
    ready: (callback: () => void) => void
    execute: (siteKey: string, options: { action?: string }) => Promise<string>
    render: ((container: string | Element, parameters: IRenderParameters) => string)
        & ((parameters: IRenderParameters) => string)
    reset: (container?: string | Element) => void
}

declare global {
    interface Window {
        grecaptcha: IReCaptchaInstance
    }
}

export const RE_CAPTCHA_INPUT = 'g-recaptcha-response'

export default defineCaptchaProvider({
    name: 'gRecaptcha',
    elementClass: 'g-recaptcha',
    inputName: RE_CAPTCHA_INPUT,
    needUserConsent: true,
    scripts: [
        {
            src: 'https://www.google.com/recaptcha/api.js',
            id: 'script-recaptcha',
            async: true,
            defer: true,
        },
    ],
    execute: async function () {
        if (!window.grecaptcha || !this.siteKey) {
            return
        }

        const token = await window.grecaptcha.execute(this.siteKey, { action: 'submit' })
        return token
    },
    render: function () {
        const id = this.getCurrentWidgetId?.() || ''
        window.grecaptcha?.render?.(id, { sitekey: this.siteKey! })
    },
    remove: function () {
        window.grecaptcha?.reset?.()
    },
})

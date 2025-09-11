import captchaFieldKey from '~/utils/captcha/providers.constants'
import { defineCaptchaProvider } from './defineCaptchaProvider'

type HCaptchaResponse = {
    response: string
    key: string
}

type ConfigRender = {
    sitekey: string
    theme?: 'light' | 'dark' | 'contrast' | object
    size?: 'normal' | 'compact' | 'invisible'
}

declare global {
    interface Window {
        hcaptcha?: {
            render(container: HTMLElement | string, config: ConfigRender): string
            execute(id?: string, config?: { async?: boolean, rqdata?: string }): Promise<HCaptchaResponse>
            reset(id?: string): void
            remove(id?: string): void
        }
    }
}

export default defineCaptchaProvider({
    name: 'hCaptcha',
    inputAttributes: {
        key: captchaFieldKey.H_CAPTCHA,
        class: 'h-captcha',
    },
    scripts: [
        {
            src: 'https://js.hcaptcha.com/1/api.js?recaptchacompat=off',
            id: 'script-h-captcha',
            defer: true,
            async: true,
        },
    ],
    needUserConsent: false,
    render: function () {
        const id = this.inputAttributes.id || ''

        window.hcaptcha?.render(id, { sitekey: this.siteKey! })
    },
    remove: function () {
        window.hcaptcha?.remove()
    },
    execute: async (token) => {
        await window.hcaptcha?.execute()
        return token
    },
})

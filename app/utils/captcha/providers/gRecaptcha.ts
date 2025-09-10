import { defineCaptchaProvider } from './defineCaptchaProvider'

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
})

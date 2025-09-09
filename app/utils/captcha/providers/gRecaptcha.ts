import type { CaptchaProvider } from '../provider-type'
import injectScript from '../utils/inject-script'

const RE_CAPTCHA_DATA = {
    elementClass: 'g-recaptcha',
    scripts: [
        {
            // src: 'https://www.google.com/recaptcha/enterprise.js',
            src: 'https://www.google.com/recaptcha/api.js',
            id: 'script-recaptcha',
            async: true,
            defer: true,
        },
    ],
} as const

export default {
    name: 're_captcha',
    inputName: 'g-recaptcha-response',
    needUserConsent: true,
    isScriptsLoaded: false,
    getDomAttributes: function (siteKey: string) {
        return {
            'class': RE_CAPTCHA_DATA.elementClass,
            'data-sitekey': siteKey,
            'data-size': 'invisible',
            // 'data-badge': 'inline',
        }
    },
    loadScript: async function (siteKey: string) {
        if (this.isScriptsLoaded) {
            return
        }

        console.log('recaptcha load script', siteKey)
        const scriptsPromise = RE_CAPTCHA_DATA.scripts.map((data) => {
            const { src, ...others } = data

            injectScript({ ...others, src: `${src}?render=${siteKey}` })
        })

        try {
            await Promise.all(scriptsPromise)
            this.isScriptsLoaded = true
        }
        catch (error) {
            console.error('error during re_captcha loading scripts', error)
        }
    },
    destroyWidget: function () {},
    execute: async (options) => {
        if (!window.grecaptcha || !options.siteKey) {
            return
        }

        const token = await window.grecaptcha.execute(options.siteKey, { action: 'submit' })
        return token
    },
} as CaptchaProvider

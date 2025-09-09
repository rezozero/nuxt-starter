import type { CaptchaProvider } from '../provider-type'
import injectScript from '../utils/inject-script'

// https://github.com/FriendlyCaptcha/friendly-captcha-sdk/blob/main/src/sdk/sdk.ts
type FriendlyCaptchaSDK = {
    widgets?: Map<string, unknown>
    agents?: Map<string, unknown>
    agentState?: Map<string, unknown>
    attach?: () => void
    clear?: () => void
}

declare global {
    interface Window {
        frcaptcha?: FriendlyCaptchaSDK
    }
}

const FRIENDLY_CAPTCHA_DATA = {
    elementClass: 'frc-captcha',
    scripts: [
        // {
        //     src: 'https://cdn.jsdelivr.net/npm/@friendlycaptcha/sdk@0.1.31/site.compat.min.js',
        //     id: 'script-friendlycaptcha-browser-support',
        //     defer: true,
        //     async: true,
        //     noModule: true,
        // },
        {
            src: 'https://cdn.jsdelivr.net/npm/@friendlycaptcha/sdk@0.1.31/site.min.js',
            id: 'script-friendlycaptcha',
            defer: true,
            async: true,
            type: 'module',
        },
    ],
} as const

// Response values used in the hidden input field when no valid solution is present
// https://developer.friendlycaptcha.com/docs/v2/sdk/reference/sdk.sentinelresponse#sentinelresponse-type
const SENTINEL_RESPONSES = ['.UNINITIALIZED', '.UNCONNECTED', '.UNSTARTED', '.REQUESTING', '.SOLVING', '.VERIFYING', '.EXPIRED', '.DESTROYED', '.ERROR', '.RESET']

export default {
    name: 'friendly_captcha',
    inputName: 'frc-captcha-response',
    needUserConsent: false,
    isScriptsLoaded: false,
    getDomAttributes: function (siteKey: string) {
        return {
            'class': FRIENDLY_CAPTCHA_DATA.elementClass,
            'data-sitekey': siteKey,
        }
    },
    loadScript: async function () {
        if (this.isScriptsLoaded) {
            window?.frcaptcha?.attach?.()
            return
        }

        const scriptsPromises = FRIENDLY_CAPTCHA_DATA.scripts.map(data => injectScript(data))

        try {
            await Promise.all(scriptsPromises)
            this.isScriptsLoaded = true
        }
        catch (error) {
            console.error('error during friendly captcha loading scripts', error)
        }
    },
    destroyWidget: function () {
        if (!window?.frcaptcha) return

        window.frcaptcha?.clear?.()
    },
    execute: ({ token }) => {
        if (!token || SENTINEL_RESPONSES.includes(token)) {
            return undefined
        }

        return token
    },
} as CaptchaProvider

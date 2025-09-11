import captchaFieldKey from '~/utils/captcha/providers.constants'
import { defineCaptchaProvider } from './defineCaptchaProvider'

declare global {
    interface Window {
        // https://github.com/FriendlyCaptcha/friendly-captcha-sdk/blob/main/src/sdk/sdk.ts
        frcaptcha?: {
            widgets?: Map<string, unknown>
            agents?: Map<string, unknown>
            agentState?: Map<string, unknown>
            attach?: () => void
            clear?: () => void
        }
    }
}

export const FRIENDLY_CAPTCHA_INPUT = 'frc-captcha-response'

// Response values used in the hidden input field when no valid solution is present
// https://developer.friendlycaptcha.com/docs/v2/sdk/reference/sdk.sentinelresponse#sentinelresponse-type
const SENTINEL_RESPONSES = ['.UNINITIALIZED', '.UNCONNECTED', '.UNSTARTED', '.REQUESTING', '.SOLVING', '.VERIFYING', '.EXPIRED', '.DESTROYED', '.ERROR', '.RESET']

export default defineCaptchaProvider({
    name: 'friendlyCaptcha',
    inputAttributes: {
        key: captchaFieldKey.FRIENDLY_CAPTCHA,
        class: 'frc-captcha',
    },
    needUserConsent: false,
    scripts: [
        {
            src: 'https://cdn.jsdelivr.net/npm/@friendlycaptcha/sdk@0.1.31/site.compat.min.js',
            id: 'script-friendlycaptcha-browser-support',
            defer: true,
            async: true,
            noModule: true,
        },
        {
            src: 'https://cdn.jsdelivr.net/npm/@friendlycaptcha/sdk@0.1.31/site.min.js',
            id: 'script-friendlycaptcha',
            defer: true,
            async: true,
            type: 'module',
        },
    ],
    render: function () {
        const el = document.querySelectorAll('.frc-captcha')
        console.log('[friednlyCaptcha]: render', el)
        window?.frcaptcha?.attach?.()
    },
    remove: function () {
        window.frcaptcha?.clear?.()
    },
    execute: (token) => {
        if (!token || SENTINEL_RESPONSES.includes(token)) {
            return undefined
        }

        return token
    },
})

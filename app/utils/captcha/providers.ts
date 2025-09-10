import { CF_TURNSTILE_INPUT } from './providers/cfTurnstile'
import type { CaptchaProvider } from './providers/defineCaptchaProvider'
import { FRIENDLY_CAPTCHA_INPUT } from './providers/frcCaptcha'
import { RE_CAPTCHA_INPUT } from './providers/gRecaptcha'
import { H_CAPTCHA_INPUT } from './providers/hCaptcha'

const modules = import.meta.glob('./providers/*.{js,ts}')
const captchaProviders: Record<string, () => Promise<{ default: CaptchaProvider }>> = {}

for (const path in modules) {
    const fileName = path.match(/\/([^/]+)\.(js|ts)$/)?.[1] // ProviderName or provider-name

    if (fileName) {
        Object.assign(captchaProviders, { [fileName]: modules[path] })
    }
}

// https://docs.roadiz.io/developer/first-steps/manual_config.html#configure-a-captcha-service-for-custom-forms-and-post-api-endpoints
// key: form input name
// value: file name from captcha/providers/* (same as runtimeConfig)

const captchaProviderInputs = {
    [CF_TURNSTILE_INPUT]: 'cfTurnstile',
    [FRIENDLY_CAPTCHA_INPUT]: 'frcCaptcha',
    [H_CAPTCHA_INPUT]: 'hCaptcha',
    [RE_CAPTCHA_INPUT]: 'gRecaptcha',
} as const

type CaptchaProviderInputKeys = keyof typeof captchaProviderInputs
type CaptchaProviderNames = typeof captchaProviderInputs[CaptchaProviderInputKeys]

export { captchaProviderInputs, captchaProviders, type CaptchaProviderInputKeys, type CaptchaProviderNames }

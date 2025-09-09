import type { CaptchaProvider } from './provider-type'

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
    'cf-turnstile-response': 'cfTurnstile',
    'frc-captcha-response': 'frcCaptcha',
    'h-captcha-response': 'hCaptcha',
    'g-recaptcha-response': 'gRecaptcha',
} as const

type CaptchaProviderInputKeys = keyof typeof captchaProviderInputs
type CaptchaProviderNames = typeof captchaProviderInputs[CaptchaProviderInputKeys]

export { captchaProviderInputs, captchaProviders, type CaptchaProviderInputKeys, type CaptchaProviderNames }

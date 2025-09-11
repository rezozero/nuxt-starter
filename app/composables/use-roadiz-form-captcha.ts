import { CF_TURNSTILE_INPUT } from '~/utils/captcha/providers/cfTurnstile'
import { FRIENDLY_CAPTCHA_INPUT } from '~/utils/captcha/providers/frcCaptcha'
import { RE_CAPTCHA_INPUT } from '~/utils/captcha/providers/gRecaptcha'
import { H_CAPTCHA_INPUT } from '~/utils/captcha/providers/hCaptcha'

// Dedicated input field name
// https://docs.roadiz.io/developer/first-steps/manual_config.html#configure-a-captcha-service-for-custom-forms-and-post-api-endpoints
// { [form_input_key]: provider file name }

const captchaProviderKeyMap = {
    [CF_TURNSTILE_INPUT]: 'cfTurnstile',
    [FRIENDLY_CAPTCHA_INPUT]: 'frcCaptcha',
    [H_CAPTCHA_INPUT]: 'hCaptcha',
    [RE_CAPTCHA_INPUT]: 'gRecaptcha',
} as const

export function getValidCaptchaKey(name: string) {
    return Object.keys(captchaProviderKeyMap)
        .find(key => key === name) as keyof typeof captchaProviderKeyMap | undefined
}

export function getProviderNameByInputKey(inputName: string) {
    const validName = getValidCaptchaKey(inputName)
    if (!validName) return undefined

    return captchaProviderKeyMap[validName]
}

export function useRoadizFormCaptcha(inputKey: MaybeRefOrGetter<string | undefined>) {
    const providerName = computed(() => {
        return getProviderNameByInputKey(toValue(inputKey) || '')
    })

    const config = useRuntimeConfig()
    const siteKey = computed(() => {
        return providerName.value ? config.public[providerName.value]?.siteKey : undefined
    })

    const enabled = computed(() => {
        return providerName.value && !!siteKey.value
    })

    return { providerName, siteKey, enabled }
}

import captchaFieldKey from '~/utils/captcha/providers.constants'

// Dedicated input field name
// https://docs.roadiz.io/developer/first-steps/manual_config.html#configure-a-captcha-service-for-custom-forms-and-post-api-endpoints
// { [form_input_key]: providerFileName }

const captchaProviderKeyMap = {
    [captchaFieldKey.TURNSTILE]: 'turnstile',
    [captchaFieldKey.FRIENDLY_CAPTCHA]: 'friendlyCaptcha',
    [captchaFieldKey.H_CAPTCHA]: 'hCaptcha',
    [captchaFieldKey.RE_CAPTCHA]: 'reCaptcha',
} as const

export type CaptchaProviderKey = keyof typeof captchaProviderKeyMap
export type CaptchaProviderNames = typeof captchaProviderKeyMap[CaptchaProviderKey]

export function getValidCaptchaKey(name: string) {
    return Object.keys(captchaProviderKeyMap)
        .find(key => key === name) as CaptchaProviderKey | undefined
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

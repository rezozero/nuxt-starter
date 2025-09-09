import type { CaptchaProviderNames } from '~/utils/captcha/providers'
import { getProviderNameByInputName } from '~/utils/captcha/utils/form'

type UseFormCaptchaOptions = {
    name?: MaybeRefOrGetter<CaptchaProviderNames | undefined>
    input?: MaybeRefOrGetter<string | undefined>
}

export function useFormCaptcha(options: UseFormCaptchaOptions) {
    const providerName = computed(() => {
        const input = toValue(options.input)

        return toValue(options.name) || (input && getProviderNameByInputName(input)) || undefined
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

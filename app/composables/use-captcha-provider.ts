import { captchaProviders, type CaptchaProviderNames } from '~/utils/captcha/providers'

type UseCaptchaProviderOptions = {
    name: MaybeRefOrGetter<CaptchaProviderNames | undefined>
    siteKey: MaybeRefOrGetter<string | undefined>
}

export async function useCaptchaProvider(options: UseCaptchaProviderOptions) {
    const name = computed(() => toValue(options.name) || '')
    const captchaApi = asyncComputed(
        async () => {
            if (!name.value) return undefined

            const provider = captchaProviders[name.value]
            return provider ? (await provider())?.default : undefined
        },
        undefined,
    )

    const domAttributes = computed(() => {
        const siteKey = toValue(options.siteKey)
        if (!captchaApi.value || !siteKey) return undefined

        return captchaApi.value.getDomAttributes({ siteKey })
    })

    // Dialog consent
    const defaultProvidersState = Object.keys(captchaProviders).reduce((acc, key) => {
        acc[key] = false
        return acc
    }, {} as Record<string, boolean>)

    const userConsent = useState('cookie_user_consent', () => defaultProvidersState)
    const setUserConsent = (newValue: boolean) => userConsent.value[name.value] = newValue

    const needUseConsentAction = computed(() => {
        return !!name.value && !!toValue(options.siteKey) && !!captchaApi.value?.needUserConsent
    })

    const displayUserConsentDialog = computed(() => {
        return needUseConsentAction.value && !userConsent.value[name.value]
    })

    const allowLoadScript = computed(() => {
        return !needUseConsentAction.value || (needUseConsentAction.value && userConsent.value[name.value])
    })

    return {
        domAttributes,
        captchaApi,
        setUserConsent,
        displayUserConsentDialog,
        allowLoadScript,
    }
}

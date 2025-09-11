import type { CaptchaProviderNames } from '~/composables/use-roadiz-form-captcha'
import { captchaProviders } from '~/utils/captcha/providers'
import type { CaptchaProvider } from '~/utils/captcha/providers/defineCaptchaProvider'

type UseCaptchaProviderOptions = {
    name: MaybeRefOrGetter<CaptchaProviderNames | undefined>
    siteKey: MaybeRefOrGetter<string | undefined>
    id?: string
    onProviderLoaded?: (provider: CaptchaProvider) => void
}

export async function useCaptchaProvider(options: UseCaptchaProviderOptions) {
    const name = computed(() => toValue(options.name) || '')
    const provider = asyncComputed(
        async () => {
            if (!name.value) return undefined

            const provider = captchaProviders[name.value]
            return provider ? (await provider())?.default : undefined
        },
        undefined,
    )

    watch(provider, async () => {
        if (!provider.value) return

        if (options.id) provider.value.inputAttributes.id = options.id

        const siteKey = toValue(options.siteKey)
        if (siteKey) provider.value.siteKey = siteKey

        await nextTick() // wait input element to be mounted
        options.onProviderLoaded?.(provider.value)
    })

    const domAttributes = computed(() => {
        const siteKey = toValue(options.siteKey)
        if (!provider.value || !siteKey) return undefined

        return provider.value.getDomAttributes({ siteKey, id: options.id })
    })

    // Dialog consent
    // TODO: Set and update userConsent depending on CMP stored data
    const userConsent = useState(`user_consents_${name.value}_cookies`, () => false)

    const needUseConsentAction = computed(() => {
        return !!name.value && !!toValue(options.siteKey) && !!provider.value?.needUserConsent
    })

    const displayUserConsentDialog = computed(() => {
        return needUseConsentAction.value && !userConsent.value
    })

    const allowLoadScript = computed(() => {
        return !needUseConsentAction.value || (needUseConsentAction.value && userConsent.value)
    })

    return {
        domAttributes,
        provider,
        userConsent,
        displayUserConsentDialog,
        allowLoadScript,
    }
}

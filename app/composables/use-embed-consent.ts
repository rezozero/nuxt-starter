import { getConsentProvider } from '~/utils/consent/providers'

export interface EmbedConsentService {
    // Service name in the CMP
    service: string
    // Name shown to the visitor
    name: string
}

// Whether an embed must wait for the visitor's consent, from `runtimeConfig.public.consent.embeds`.
// Without a known consent provider (`runtimeConfig.public.consent.provider`), nothing is held back.
export function useEmbedConsent(platform: MaybeRefOrGetter<string | undefined>) {
    const consentConfig = useRuntimeConfig().public.consent
    const embeds = getConsentProvider(consentConfig?.provider)
        ? consentConfig?.embeds as Partial<Record<string, EmbedConsentService>> | undefined
        : undefined
    const { isGranted, request } = useConsent()

    const service = computed(() => {
        const key = toValue(platform)?.toLowerCase()

        return key ? embeds?.[key] : undefined
    })

    // Once unlocked, an embed stays so as long as it is mounted: tearing down a running player
    // would fight the player over the DOM. A revocation applies from the next render.
    const unlocked = ref(false)

    watch(
        () => !!service.value && isGranted(service.value.service),
        (granted) => {
            if (granted) unlocked.value = true
        },
        { immediate: true },
    )

    const blocked = computed(() => !!service.value && !unlocked.value)

    return {
        service,
        blocked,
        request: () => service.value && request(service.value.service),
    }
}

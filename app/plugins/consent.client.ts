import { getConsentProvider } from '~/utils/consent/providers'

// In ms, after the page load. The CMP may be brought late by a tag manager.
const CMP_LOAD_TIMEOUT = 5000

/*
 * Consent management platform (CMP) bridge
 * Inactive while `runtimeConfig.public.consent.provider` (NUXT_PUBLIC_CONSENT_PROVIDER) is empty.
 * Feeds `useConsent()` with the services granted by the visitor, and opens the consent settings
 * on click on any link to `runtimeConfig.public.consent.settingsHref`.
 */
export default defineNuxtPlugin({
    name: 'consent',
    parallel: true,
    setup() {
        const config = useRuntimeConfig().public.consent
        const provider = getConsentProvider(config?.provider)

        if (!provider) return

        const { grantedServices, status, open } = useConsent()

        // Not before hydration: the CMP may already know the choice, and the page would no
        // longer match the server render, made without it.
        onNuxtReady(() => {
            provider.onLoad(() => (status.value = 'loaded'))
            provider.onChange(services => (grantedServices.value = services))

            // The CMP may never come (consent tag or SDK blocked by an ad blocker): past a delay
            // after the page load, it is taken as unavailable — until it shows up after all.
            const giveUpLater = () => window.setTimeout(() => {
                if (status.value === 'pending') status.value = 'unavailable'
            }, CMP_LOAD_TIMEOUT)

            if (document.readyState === 'complete') giveUpLater()
            else window.addEventListener('load', giveUpLater, { once: true })
        })

        const settingsHref = config?.settingsHref?.trim().toLowerCase()

        if (!settingsHref) return

        // Delegated on the document, so it also covers links rendered from Markdown or after hydration
        document.addEventListener('click', (event) => {
            const link = (event.target as Element | null)?.closest?.('a[href]')

            if (link?.getAttribute('href')?.trim().toLowerCase() !== settingsHref) return

            event.preventDefault()
            open()
        })
    },
})

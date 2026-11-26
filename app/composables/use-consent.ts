import { getConsentProvider } from '~/utils/consent/providers'

// `pending` until the CMP loads, or until the `consent` plugin gives up on it (`unavailable`)
export type ConsentStatus = 'pending' | 'loaded' | 'unavailable'

// Clicked again while waiting for the CMP: a single answer
let isOpenPending = false

// Services granted by the visitor, fed by the `consent` plugin. Always empty on the server:
// pages are cached regardless of the visitor's choice.
export function useConsent() {
    const grantedServices = useState<string[]>('consent_granted_services', () => [])
    const status = useState<ConsentStatus>('consent_status', () => 'pending')
    // Shown instead of the consent settings when the CMP is missing (VConsentUnavailableDialog)
    const isUnavailableDialogOpen = useState('consent_unavailable_dialog_open', () => false)
    const provider = getConsentProvider(useRuntimeConfig().public.consent?.provider)

    // Asked before the CMP loads or is given up on: answered once its status is known
    function open() {
        if (!provider) return

        if (status.value === 'pending') {
            if (isOpenPending) return

            isOpenPending = true
            watch(status, () => {
                isOpenPending = false
                open()
            }, { once: true })
        }
        else if (status.value === 'loaded') provider.open()
        else isUnavailableDialogOpen.value = true
    }

    return {
        grantedServices,
        status,
        // The CMP never came (blocked by an ad blocker, for instance): nothing can be granted
        unavailable: computed(() => status.value === 'unavailable'),
        isUnavailableDialogOpen,
        isGranted: (service: string) => grantedServices.value.includes(service),
        request: (service: string) => provider?.request(service),
        open,
    }
}

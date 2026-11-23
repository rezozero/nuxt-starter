import type { ConsentProvider } from './define-consent-provider'
import axeptio from './providers/axeptio'

// Supporting another CMP: add its adapter here, then set `runtimeConfig.public.consent.provider`.
const consentProviders: Partial<Record<string, ConsentProvider>> = {
    axeptio,
}

export function getConsentProvider(name: string | undefined): ConsentProvider | undefined {
    return name ? consentProviders[name] : undefined
}

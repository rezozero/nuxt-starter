// What the site needs from a consent management platform (CMP). Services are identified by the
// names declared in the CMP itself (an Axeptio vendor, for instance), so the rest of the code
// never depends on which CMP is in use.
export interface ConsentProvider {
    // Calls back once the CMP is loaded. Never called when it is missing (blocked by an ad
    // blocker, for instance): the `consent` plugin then gives up on it after a delay.
    onLoad: (callback: () => void) => void
    // Calls back with the services the visitor granted, once the CMP knows them, then on every
    // later choice. Never called while the visitor has not chosen yet: nothing is granted then.
    onChange: (callback: (grantedServices: string[]) => void) => void
    // Asks the visitor to grant a single service
    request: (service: string) => void
    // Opens the consent settings
    open: () => void
    // Origins the CMP loads from, connected to ahead of its script (`anonymous` for CORS requests)
    preconnect?: { href: string, crossorigin?: 'anonymous' }[]
}

export function defineConsentProvider(provider: ConsentProvider): ConsentProvider {
    return provider
}

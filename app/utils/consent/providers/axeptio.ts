import { defineConsentProvider } from '../define-consent-provider'
import { suspendModalDialogs } from '../suspend-modal-dialogs'

interface AxeptioSDK {
    on: (event: 'cookies:complete', callback: (choices: Record<string, boolean>) => void) => void
    requestConsent: (vendor: string) => void
}

interface AxeptioApi {
    _axcb?: Array<(sdk: AxeptioSDK) => void>
    openAxeptioCookies?: () => void
}

declare global {
    interface Window extends AxeptioApi { }
}

// The Axeptio SDK is not loaded by the app but by the site setup (a tag manager tag, for instance),
// so it may never come (tag blocked, ad blocker): queued callbacks then never run, and nothing is granted.
function withSDK(callback: (sdk: AxeptioSDK) => void) {
    window._axcb = window._axcb || []
    window._axcb.push(callback)
}

let resumeModalDialogs: (() => void) | null = null

export default defineConsentProvider({
    preconnect: [
        // SDK and widget scripts
        { href: 'https://static.axept.io' },
        // Project configuration, fetched by the SDK
        { href: 'https://client.axept.io', crossorigin: 'anonymous' },
    ],
    onLoad(callback) {
        withSDK(() => callback())
    },
    onChange(callback) {
        withSDK((sdk) => {
            sdk.on('cookies:complete', (choices) => {
                // `choices` also carries `$$completed` & co.
                callback(Object.keys(choices).filter(key => !key.startsWith('$$') && choices[key] === true))

                resumeModalDialogs?.()
                resumeModalDialogs = null
            })
        })
    },
    request(service) {
        withSDK((sdk) => {
            resumeModalDialogs ??= suspendModalDialogs()
            sdk.requestConsent(service)
        })
    },
    open() {
        window.openAxeptioCookies?.()
    },
})

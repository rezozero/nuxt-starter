export type CaptchaProvider = {
    name: string
    inputName: string
    isScriptsLoaded: boolean
    needUserConsent: boolean
    getDomAttributes: (siteKey: string) => Record<string, unknown>
    loadScript: (siteKey?: string) => Promise<void>
    initWidget?: (siteKey: string, element?: HTMLElement) => void
    execute: (options: { siteKey?: string, token?: string }) => string | Promise<string>
    destroyWidget: () => void
}

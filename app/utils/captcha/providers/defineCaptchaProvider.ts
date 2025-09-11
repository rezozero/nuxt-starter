import { injectScript, type ScriptAttributes } from '../utils/inject-script'

type CaptchaInputAttributes = {
    [key: string]: string | undefined
    siteKey: string
    size?: 'normal' | 'compact' | 'invisible'
}

type ExecuteResponse = string | undefined | Promise<string | undefined>

export type CaptchaProvider = {
    name: string
    inputAttributes: {
        [key: string]: string
        key: string
        class: string
    }
    scripts: ScriptAttributes[]
    scriptsLoaded: boolean
    needUserConsent: boolean
    siteKey: string
    getDomAttributes: (options: CaptchaInputAttributes) => Record<string, string | boolean | undefined | (() => void)>
    loadScript: () => Promise<void>
    render: undefined | (() => void) | undefined
    execute: ((token?: string) => ExecuteResponse) | undefined
    remove: (() => void) | undefined
}

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type OptionalOptionKeys = 'siteKey' | 'loadScript' | 'getDomAttributes' | 'scriptsLoaded' | 'needUserConsent' | 'render' | 'remove'
type RequiredProviderOptions = WithOptional<CaptchaProvider, OptionalOptionKeys>

export function defineCaptchaProvider(options: RequiredProviderOptions) {
    return {
        siteKey: '',
        scriptsLoaded: false,
        needUserConsent: true,
        getDomAttributes: function (options: CaptchaInputAttributes) {
            return {
                ...this.inputAttributes,
                'class': options.class || this.inputAttributes.class,
                'data-sitekey': options.siteKey || this.siteKey,
                'data-size': options.size || 'normal',
            }
        },
        loadScript: async function () {
            if (this.scriptsLoaded && this.render) {
                this.render?.()
                return
            }

            // Promise won't be resolved on browser with module script support
            const scriptsPromises = this.scripts.filter((script) => {
                const supportsModule = 'noModule' in document.createElement('script')
                return supportsModule ? !script.noModule : script.noModule
            }).map(data => injectScript(data))

            try {
                await Promise.all(scriptsPromises)
                this.scriptsLoaded = true
            }
            catch (error) {
                console.error(`Error during ${this.name} scripts loading`, error)
            }
        },
        render: () => {},
        remove: () => {},
        ...options,
    } as CaptchaProvider
}

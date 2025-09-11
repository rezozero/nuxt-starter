import { injectScript, type ScriptAttributes } from '../utils/inject-script'

type CaptchaWidgetAttributes = {
    siteKey: string
    size?: 'normal' | 'compact' | 'invisible'
    id?: string
    class?: string
}

type ExecuteResponse = string | undefined | Promise<string | undefined>

export type CaptchaProvider = {
    name: string
    inputName: string
    elementClass: string
    scripts: ScriptAttributes[]
    scriptsLoaded: boolean
    needUserConsent: boolean
    widgetInstanceIndex: number
    siteKey: string
    getCurrentWidgetId: () => string
    getDomAttributes: (options: CaptchaWidgetAttributes) => Record<string, string | boolean | undefined | (() => void)>
    loadScript: (siteKey: string) => Promise<void>
    render: undefined | (() => void) | undefined
    execute: ((token?: string) => ExecuteResponse) | undefined
    remove: (() => void) | undefined
}

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type OptionalOptionKeys = 'siteKey' | 'remove' | 'render' | 'loadScript' | 'getDomAttributes' | 'getCurrentWidgetId' | 'scriptsLoaded' | 'needUserConsent' | 'widgetInstanceIndex'
type RequiredProviderOptions = WithOptional<CaptchaProvider, OptionalOptionKeys>

const defaultOptions = {
    name: '',
    elementClass: '',
    siteKey: '',
    inputName: '',
    scripts: [],
    scriptsLoaded: false,
    needUserConsent: true,
    widgetInstanceIndex: 0,
    getCurrentWidgetId: function () {
        return this.name + '-' + this.widgetInstanceIndex
    },
    getDomAttributes: function (options: CaptchaWidgetAttributes) {
        this.widgetInstanceIndex++
        return {
            'class': options.class || this.elementClass,
            'data-sitekey': options.siteKey || this.siteKey,
            'data-size': options.size || 'normal',
            'id': options.id || this.getCurrentWidgetId(),
        }
    },
    render: undefined,
    loadScript: async function (siteKey: string) {
        this.siteKey = siteKey
        if (this.scriptsLoaded && this.render) {
            this.render?.()
        }
        else {
            const scriptsPromises = this.scripts.map(data => injectScript(data))

            try {
                await Promise.all(scriptsPromises)
                this.scriptsLoaded = true
            }
            catch (error) {
                console.error(`Error during ${this.name} scripts loading`, error)
            }
        }
    },
    execute: undefined,
    remove: undefined,
} satisfies CaptchaProvider

export function defineCaptchaProvider(options: RequiredProviderOptions) {
    const keys = Object.keys(defaultOptions) as (keyof CaptchaProvider)[]

    return keys.reduce((acc, key) => {
        if (key in options && options[key] !== undefined) {
            Object.assign(acc, { [key]: options[key] })
        }
        else if (key in defaultOptions && defaultOptions[key] !== undefined) {
            Object.assign(acc, { [key]: defaultOptions[key] })
        }

        return acc
    }, {} as CaptchaProvider)
}

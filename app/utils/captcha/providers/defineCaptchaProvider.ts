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
    isScriptsLoaded: boolean
    needUserConsent: boolean
    widgetInstanceIndex: number
    siteKey: string
    getCurrentWidgetId: () => string
    getDomAttributes: (options: CaptchaWidgetAttributes) => Record<string, string | boolean | undefined | (() => void)>
    loadScript: (siteKey: string) => Promise<void>
    recreateWidget: undefined | (() => void) | undefined
    execute: ((token?: string) => ExecuteResponse) | undefined
    destroyWidget: (() => void) | undefined
}

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type OptionalOptionKeys = 'siteKey' | 'destroyWidget' | 'recreateWidget' | 'loadScript' | 'getDomAttributes' | 'getCurrentWidgetId' | 'isScriptsLoaded' | 'needUserConsent' | 'widgetInstanceIndex'
type RequiredProviderOptions = WithOptional<CaptchaProvider, OptionalOptionKeys>

const defaultOptions = {
    name: '',
    elementClass: '',
    siteKey: '',
    inputName: '',
    scripts: [],
    isScriptsLoaded: false,
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
    recreateWidget: undefined,
    loadScript: async function (siteKey: string) {
        this.siteKey = siteKey
        if (this.isScriptsLoaded && this.recreateWidget) {
            this.recreateWidget?.()
        }
        else {
            const scriptsPromises = this.scripts.map(data => injectScript(data))

            try {
                await Promise.all(scriptsPromises)
                this.isScriptsLoaded = true
            }
            catch (error) {
                console.error(`error during ${this.name} loading scripts`, error)
            }
        }
    },
    execute: undefined,
    destroyWidget: undefined,
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

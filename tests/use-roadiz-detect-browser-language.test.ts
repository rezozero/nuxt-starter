import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRoadizDetectBrowserLanguage } from '../app/composables/use-roadiz-detect-browser-language'

const alternateLinks = [
    { locale: 'fr', url: '/' },
    { locale: 'en', url: '/en' },
]

function stubContext(options: {
    path?: string
    cookieLocale?: string
    browserLocale?: string
    detectBrowserLanguage?: Record<string, unknown> | false
}) {
    const vary: { value?: string } = {}
    const event = {}
    const navigateTo = vi.fn()
    const setResponseStatus = vi.fn()

    vi.stubGlobal('useRuntimeConfig', () => ({
        public: {
            i18n: {
                detectBrowserLanguage: options.detectBrowserLanguage ?? {
                    useCookie: true,
                    cookieKey: 'i18n_redirected',
                    redirectOn: 'root',
                    alwaysRedirect: false,
                },
            },
        },
    }))
    vi.stubGlobal('useRoute', () => ({ path: options.path ?? '/' }))
    vi.stubGlobal('useResponseHeader', () => vary)
    vi.stubGlobal('useRequestEvent', () => event)
    vi.stubGlobal('useNuxtApp', () => ({
        $i18n: {
            getLocaleCookie: () => options.cookieLocale,
            locales: { value: [{ code: 'fr' }, { code: 'en' }] },
        },
    }))
    vi.stubGlobal('useBrowserLocale', () => options.browserLocale ?? null)
    vi.stubGlobal('navigateTo', navigateTo)
    vi.stubGlobal('setResponseStatus', setResponseStatus)

    return { vary, event, navigateTo, setResponseStatus }
}

describe('useRoadizDetectBrowserLanguage', () => {
    beforeEach(() => vi.unstubAllGlobals())
    afterEach(() => vi.unstubAllGlobals())

    it('redirects a root page to the browser language with an uncacheable 302', async () => {
        const { vary, event, navigateTo, setResponseStatus } = stubContext({ browserLocale: 'en' })

        await useRoadizDetectBrowserLanguage({ locale: 'fr', alternateLinks })

        expect(vary.value).toBe('Accept-Language, Cookie')
        expect(setResponseStatus).toHaveBeenCalledWith(event, 302)
        expect(navigateTo).toHaveBeenCalledWith('/en', expect.objectContaining({ redirectCode: 302, external: true }))
    })

    it('varies on the visitor language even when it does not redirect', async () => {
        const { vary, navigateTo } = stubContext({ browserLocale: 'fr' })

        await useRoadizDetectBrowserLanguage({ locale: 'fr', alternateLinks })

        expect(vary.value).toBe('Accept-Language, Cookie')
        expect(navigateTo).not.toHaveBeenCalled()
    })

    it('does not redirect when the visitor already chose a locale', async () => {
        const { navigateTo } = stubContext({ browserLocale: 'en', cookieLocale: 'fr' })

        await useRoadizDetectBrowserLanguage({ locale: 'fr', alternateLinks })

        expect(navigateTo).not.toHaveBeenCalled()
    })

    it('follows the cookie over the browser language when always redirecting', async () => {
        const { navigateTo } = stubContext({
            browserLocale: 'fr',
            cookieLocale: 'en',
            detectBrowserLanguage: { useCookie: true, redirectOn: 'root', alwaysRedirect: true },
        })

        await useRoadizDetectBrowserLanguage({ locale: 'fr', alternateLinks })

        expect(navigateTo).toHaveBeenCalledWith('/en', expect.anything())
    })

    it('only varies on Accept-Language without the cookie', async () => {
        const { vary } = stubContext({
            browserLocale: 'fr',
            detectBrowserLanguage: { useCookie: false, redirectOn: 'root' },
        })

        await useRoadizDetectBrowserLanguage({ locale: 'fr', alternateLinks })

        expect(vary.value).toBe('Accept-Language')
    })

    it('leaves other pages untouched when only redirecting on root', async () => {
        const { vary, navigateTo } = stubContext({ path: '/about', browserLocale: 'en' })

        await useRoadizDetectBrowserLanguage({
            locale: 'fr',
            alternateLinks: [{ locale: 'fr', url: '/about' }, { locale: 'en', url: '/en/about' }],
        })

        expect(vary.value).toBeUndefined()
        expect(navigateTo).not.toHaveBeenCalled()
    })

    it('does not redirect to a locale the page is not translated in', async () => {
        const { navigateTo, setResponseStatus } = stubContext({ browserLocale: 'en' })

        await useRoadizDetectBrowserLanguage({ locale: 'fr', alternateLinks: [{ locale: 'fr', url: '/' }] })

        expect(setResponseStatus).not.toHaveBeenCalled()
        expect(navigateTo).not.toHaveBeenCalled()
    })

    it('does nothing when browser language detection is disabled', async () => {
        const { vary, navigateTo } = stubContext({ browserLocale: 'en', detectBrowserLanguage: false })

        await useRoadizDetectBrowserLanguage({ locale: 'fr', alternateLinks })

        expect(vary.value).toBeUndefined()
        expect(navigateTo).not.toHaveBeenCalled()
    })
})

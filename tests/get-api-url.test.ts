import { afterEach, describe, expect, it, vi } from 'vitest'
import { getApiUrl } from '../shared/utils/get-api-url'

function stubConfig(config: { serverApiUrl?: string, api?: string, site?: string }) {
    vi.stubGlobal('useRuntimeConfig', () => ({
        serverApiUrl: config.serverApiUrl ?? '',
        public: {
            api: { url: config.api ?? '', endpointPrefix: '/api' },
            site: { url: config.site ?? '' },
        },
    }))
}

describe('getApiUrl on server', () => {
    afterEach(() => vi.unstubAllGlobals())

    // Regression: a relative `/api` base makes SSR fetch Nuxt itself, looping until OOM.
    it('throws instead of returning a relative URL when nothing is configured', () => {
        stubConfig({})
        expect(() => getApiUrl()).toThrow(/No API URL/)
    })

    it('prefers serverApiUrl, then public api url, then site url', () => {
        stubConfig({ serverApiUrl: 'http://internal', api: 'https://api.test', site: 'https://site.test' })
        expect(getApiUrl()).toBe('http://internal/api')

        stubConfig({ api: 'https://api.test', site: 'https://site.test' })
        expect(getApiUrl()).toBe('https://api.test/api')

        stubConfig({ site: 'https://site.test' })
        expect(getApiUrl()).toBe('https://site.test/api')
    })
})

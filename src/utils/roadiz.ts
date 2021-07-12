import { RoadizNodesSources } from '@roadiz/abstract-api-client/dist/types/roadiz'
import RoadizApi from '@roadiz/abstract-api-client'
import toBoolean from './to-boolean'

export function getNodesSourcesTitle(data: RoadizNodesSources | undefined): string | undefined {
    return data?.metaTitle || data?.title
}

export function sitemapOptions(availableLocales: Array<string>) {
    if (!process.env.API_URL || !process.env.API_KEY) {
        throw new Error('API credentials are not configured.')
    }
    if (!availableLocales || availableLocales.length < 1) {
        throw new Error('No available locale is configured.')
    }

    const $roadiz = new RoadizApi(
        process.env.API_URL,
        process.env.API_KEY,
        toBoolean(process.env.API_PREVIEW),
        toBoolean(process.env.API_DEBUG)
    )

    const sitemaps: Array<object> = []
    availableLocales.forEach((locale: string) => {
        sitemaps.push({
            path: `/sitemap/sitemap-${locale}.xml`,
            changefreq: 'daily',
            lastmod: new Date(),
            routes: async () => await $roadiz.fetchAllUrlsForLocale(locale),
            exclude: ['/ui'],
        })
    })
    return new Promise((resolve) => {
        resolve({
            i18n: true,
            path: '/sitemap.xml',
            cacheTime: 1000 * 60 * 60 * 2,
            exclude: ['/ui'],
            sitemaps,
        })
    })
}

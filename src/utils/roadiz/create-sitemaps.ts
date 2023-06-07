import RoadizApi from '@roadiz/abstract-api-client'
import { joinURL } from 'ufo'
import toBoolean from '../to-boolean'

export default function createSitemaps(locales: Array<string>) {
    return locales.map((locale: string) => {
        return {
            path: `/sitemap/sitemap-${locale}.xml`,
            routes() {
                if (!process.env.API_URL) {
                    throw new Error('API URL is not configured.')
                }

                if (!locales || locales.length < 1) {
                    throw new Error('No available locale is configured.')
                }

                const $roadiz = new RoadizApi(
                    joinURL(process.env.API_URL || '', process.env.API_ENDPOINT_PREFIX || ''),
                    {
                        apiKey: process.env.API_KEY,
                        preview: toBoolean(process.env.API_PREVIEW),
                        debug: toBoolean(process.env.API_DEBUG),
                    }
                )

                // By default, pages with noIndex won't be fetched.
                // Therefore, if a page should not appear into the sitemap, activate the noIndex property into the Roadiz SEO tab of that node.
                return $roadiz.fetchAllUrlsForLocale(locale)
            },
        }
    })
}

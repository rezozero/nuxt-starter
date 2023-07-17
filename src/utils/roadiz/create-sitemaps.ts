import { HydraCollection } from '@roadiz/abstract-api-client/dist/types/hydra'
import { RoadizTranslation } from '@roadiz/abstract-api-client/dist/types/roadiz'
import createRoadiz from './create-roadiz'

interface Route {
    name?: string
    path?: string
    component?: string
    chunkName?: string
    url: string
}

const ROUTES_NAME_SEPARATOR = '___'

export default function createSitemaps(locales: Array<string>) {
    return locales.map((locale: string) => {
        return {
            path: `/sitemap/sitemap-${locale}.xml`,
            async routes() {
                if (!process.env.API_URL && !process.env.BASE_URL) {
                    throw new Error('API URL or BASE URL is not configured.')
                }

                if (!locales || locales.length < 1) {
                    throw new Error('No available locale is configured.')
                }

                const roadiz = createRoadiz()
                // const today = new Date()
                // today.setFullYear(today.getFullYear() - 2)

                const roadizLocales = await roadiz
                    .get<HydraCollection<RoadizTranslation>>('/translations', { params: { available: true } })
                    .then(({ data }) => data['hydra:member'].map(({ locale }) => locale))

                if (!roadizLocales.includes(locale)) return []

                return [
                    ...(await roadiz.fetchAllUrlsForLocale(locale, false)),
                    // ...(await fetchAllForLocale(roadiz, '/events', locale, {
                    //     'sortingDateTime[after]': today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate(),
                    // })),
                ]
            },
            filter({ routes }: { routes: Route[] }) {
                return routes.filter((route) => {
                    const routeLocale = route.name?.split(ROUTES_NAME_SEPARATOR)[1]

                    return !routeLocale || routeLocale === locale
                })
            },
        }
    })
}

// TODO: move this function to abstract client API
// async function fetchAllForLocale(
//     roadiz: RoadizApi,
//     path: string,
//     _locale = 'fr',
//     params: RoadizRequestParams = {}
// ): Promise<Array<string>> {
//     let page = 1
//     let active = true
//     const refs = [] as Array<string>
//
//     do {
//         await roadiz
//             .get<HydraCollection<any>>(path, {
//                 params: {
//                     properties: ['url'],
//                     page,
//                     itemsPerPage: 50,
//                     _locale,
//                     ...params,
//                 },
//             })
//             .then(({ data }): void => {
//                 if (data && data['hydra:member'] && data['hydra:totalItems']) {
//                     data['hydra:member'].forEach((entry): void => {
//                         if (entry.url) {
//                             refs.push(entry.url)
//                         }
//                     })
//                     active = !!(data['hydra:view'] && data['hydra:view']['hydra:next'])
//                     ++page
//                 }
//             })
//     } while (active)
//
//     return refs
// }

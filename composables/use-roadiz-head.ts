import { joinURL } from 'ufo'
import type { RoadizAlternateLink, RoadizWebResponse } from '@roadiz/types'
import type { Link, Script } from '@unhead/schema'

export function useRoadizHead(webResponse?: RoadizWebResponse, alternateLinks?: RoadizAlternateLink[]) {
    const nuxtApp = useNuxtApp()
    const route = useRoute()
    const runtimeConfig = useRuntimeConfig()
    const { $i18n } = nuxtApp
    const script: (Script<['script']> | string)[] = []
    const link: Link[] = [
        {
            rel: 'canonical',
            href: joinURL(runtimeConfig.public.site.url, webResponse?.item?.url || route.path),
        },
    ]

    // ALTERNATE LINKS
    const alternateLinksHead = alternateLinks?.map((alternateLink: RoadizAlternateLink) => {
        return {
            hid: `alternate-${alternateLink.locale}`,
            rel: 'alternate',
            hreflang: alternateLink.locale,
            href: joinURL(runtimeConfig.public.site.url, alternateLink.url),
        }
    })
    if (alternateLinksHead) link.push(...alternateLinksHead)

    useHead({
        htmlAttrs: {
            lang: $i18n.locale.value,
        },
        script,
        link,
        meta: [
            // app version
            { name: 'version', content: runtimeConfig.public.version },
        ],
    })
}

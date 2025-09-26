import { joinURL } from 'ufo'
import type { RoadizAlternateLink, RoadizWebResponse } from '@roadiz/types'
import type { UseHeadInput } from 'unhead/types'

export function useRoadizHead(webResponse?: RoadizWebResponse, alternateLinks?: RoadizAlternateLink[]) {
    const nuxtApp = useNuxtApp()
    const runtimeConfig = useRuntimeConfig()
    const { $i18n } = nuxtApp

    const script: UseHeadInput['script'] = []
    const link: UseHeadInput['link'] = [
        {
            rel: 'canonical',
            href: useCanonicalUrl(webResponse?.item?.url),
        },
    ]

    // ALTERNATE LINKS
    const alternateLinksHead = alternateLinks
        ?.filter(alternateLink => alternateLink.url)
        .map((alternateLink: RoadizAlternateLink) => {
            return {
                hid: `alternate-${alternateLink.locale}`,
                rel: 'alternate',
                hreflang: alternateLink.locale,
                href: joinURL(runtimeConfig.public.site.url, alternateLink.url!),
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

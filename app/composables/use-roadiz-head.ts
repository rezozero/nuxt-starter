import { joinURL } from 'ufo'
import type { RoadizAlternateLink, RoadizWebResponse } from '@roadiz/types'
import type { ResolvableLink, ResolvableScript } from '@unhead/vue'

export function useRoadizHead(webResponse?: RoadizWebResponse, alternateLinks?: RoadizAlternateLink[]) {
    const nuxtApp = useNuxtApp()
    const runtimeConfig = useRuntimeConfig()
    const { $i18n } = nuxtApp

    const script: ResolvableScript[] = []
    const link: ResolvableLink[] = []

    const canonicalUrl = useCurrentPageSearchParams().canonicalUrl.value
    if (canonicalUrl) {
        link.push({
            rel: 'canonical',
            href: canonicalUrl,
        })
    }

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
            {
                name: 'version',
                content: runtimeConfig.public.version,
            },
        ],
    })
}

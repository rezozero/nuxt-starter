import { joinURL } from 'ufo'
import type { RoadizAlternateLink, RoadizWebResponse } from '@roadiz/types'
import type { Link, Script } from '@unhead/schema'
import { createGoogleTagManagerScript } from '~/utils/tracking/google-tag-manager'
import { createMatomoTagManagerScript } from '~/utils/tracking/matomo-tag-manager'

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

    // GOOGLE TAG MANAGER
    // Google Tag Manager must not be loaded by tarteaucitron, it must configure tarteaucitron itself.
    // Notice: by using GTM you must comply with GDPR and cookie consent or just use
    // tarteaucitron with GA4, Matomo or Plausible
    const googleTagManager = runtimeConfig.public.googleTagManager
    if (googleTagManager && googleTagManager !== '') {
        script.push(createGoogleTagManagerScript(googleTagManager))
    }

    // MATOMO
    const matomoURL = runtimeConfig.public.matomo?.url
    const matomoContainerID = runtimeConfig.public.matomo?.containerID
    if (matomoURL && matomoContainerID && matomoURL !== '' && matomoContainerID !== '') {
        script.push(createMatomoTagManagerScript(matomoContainerID, matomoURL))
    }

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

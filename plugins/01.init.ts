import { joinURL } from 'ufo'
import type { RoadizAlternateLink, RoadizNodesSources, RoadizWebResponse } from '@roadiz/types'
import type { Link, Script } from '@unhead/schema'
import { COMMON_CONTENT_KEY, useCommonContent } from '~/composables/use-common-content'
import { createGoogleTagManagerScript } from '~/utils/tracking/google-tag-manager'
import { createMatomoTagManagerScript } from '~/utils/tracking/matomo-tag-manager'

async function initI18n(locale?: string) {
    const nuxtApp = useNuxtApp()

    if (locale) {
        const { $i18n } = nuxtApp
        await $i18n.setLocale(locale)
    }
    else {
        // get the locale from the route (prefix) or cookie ?
    }
}

async function initCommonContent() {
    await useRoadizFetch('/common_content', {
        key: COMMON_CONTENT_KEY,
    })
}

function initHead(webResponse?: RoadizWebResponse, alternateLinks?: RoadizAlternateLink[]) {
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

function initSeoMeta(webResponse?: RoadizWebResponse) {
    const nuxtApp = useNuxtApp()
    const { commonContent } = useCommonContent()
    const runtimeConfig = useRuntimeConfig()
    const head = webResponse?.head
    const description = webResponse?.head?.metaDescription || commonContent.value?.head?.metaDescription
    const title = webResponse?.head?.metaTitle || commonContent.value?.head?.metaTitle
    const siteName = commonContent.value?.head?.siteName || (nuxtApp.$config.siteName as string) || ''
    const { isActive: previewIsActive } = useRoadizPreview()
    const img = useImage()
    const image = () => {
        const image
            = head?.shareImage?.relativePath
            // @ts-ignore not sure the `images` property exists, but generally it does
            || head?.images?.[0]?.relativePath
            // @ts-ignore not sure the `image` property exists, but generally it does
            || head?.image?.[0]?.relativePath
            || commonContent.value?.head?.shareImage?.relativePath

        if (image) {
            return img(
                image,
                {
                    width: 1200,
                    crop: '1200x630',
                    quality: 70,
                },
                {
                    provider: 'interventionRequest',
                },
            )
        }
        else {
            return joinURL(runtimeConfig.public.site.url, '/images/share.jpg')
        }
    }

    useServerSeoMeta({
        description,
        ogTitle: title,
        ogSiteName: siteName,
        ogDescription: description,
        ogImage: image(),
        twitterCard: 'summary',
        twitterTitle: title,
        twitterDescription: description,
        robots: {
            noindex: (webResponse?.item as RoadizNodesSources)?.noIndex || previewIsActive.value,
        },
    })
}

export default defineNuxtPlugin(async () => {
    const route = useRoute()
    const isWildCardRoute = route.name === 'slug'
    const data = isWildCardRoute ? await useRoadizWebResponse() : undefined
    const locale = data && ((data.item as RoadizNodesSources)?.translation?.locale || undefined)

    if (locale) {
        // Set currentPage data accessible outside pages
        useCurrentPage().value = {
            webResponse: data.webResponse,
            alternateLinks: data.alternateLinks,
        }

        await initI18n(locale)
        useAlternateLinks(data?.alternateLinks)
    }
    await initCommonContent()
    initHead(data?.webResponse, data?.alternateLinks)
    initSeoMeta(data?.webResponse)
})

import type { ReactiveHead } from '@unhead/vue'
import type { MaybeRefOrGetter } from 'vue'
import { truncate } from '~/utils/string/truncate'
import { joinURL } from 'ufo'

export interface PageMetaAlternateLink {
    locale: string
    href: string
}

export interface PageMetaOptions {
    title?: MaybeRefOrGetter<string | null | undefined>
    description?: MaybeRefOrGetter<string | null | undefined>
    image?: MaybeRefOrGetter<string | undefined>
    siteName?: MaybeRefOrGetter<string | undefined>
    noindex?: MaybeRefOrGetter<boolean | undefined>
    canonicalUrl?: MaybeRefOrGetter<string | null | undefined>
    alternateLinks?: MaybeRefOrGetter<PageMetaAlternateLink[] | undefined>
}

/**
 * Generic page meta/head builder, independent from any CMS.
 * Backend-specific composables (e.g. useRoadizMeta) should resolve their own
 * title/description/image/etc. and pass them here as default options.
 */
export function usePageMeta(options: PageMetaOptions = {}) {
    const runtimeConfig = useRuntimeConfig()
    const { $i18n } = useNuxtApp()

    const title = computed(() => toValue(options.title) || '')
    const description = computed(() => toValue(options.description) || '')
    const truncatedDescription = computed(() => truncate(description.value, 160))
    const image = computed(() => toValue(options.image) || joinURL(runtimeConfig.app.cdnUrl || runtimeConfig.public.site.url, '/images/share.jpg'))
    const siteName = computed(() => toValue(options.siteName) || runtimeConfig.public.site.name || '')
    const noindex = computed(() => !!toValue(options.noindex))
    const canonicalUrl = computed(() => toValue(options.canonicalUrl) || undefined)

    const link = computed<ReactiveHead['link']>(() => {
        const links: NonNullable<ReactiveHead['link']> = []

        if (canonicalUrl.value) {
            links.push({
                rel: 'canonical',
                href: canonicalUrl.value,
            })
        }

        const alternateLinks = toValue(options.alternateLinks)
        if (alternateLinks) {
            links.push(...alternateLinks.map(alternateLink => ({
                hid: `alternate-${alternateLink.locale}`,
                rel: 'alternate',
                hreflang: alternateLink.locale,
                href: alternateLink.href,
            })))
        }

        return links
    })

    const head = computed(() => ({
        htmlAttrs: {
            lang: $i18n.locale.value,
        },
        link: link.value,
        title: title.value,
        meta: [
            // app version
            {
                name: 'version',
                content: runtimeConfig.public.version,
            },
            // SEO meta
            // Update on server AND during client side navigation.
            // The client side update is required for the share on iOS Safari feature
            // to have the correct meta data when sharing.
            { name: 'description', content: truncatedDescription.value },
            { property: 'og:title', content: title.value },
            { property: 'og:site_name', content: siteName.value },
            { property: 'og:description', content: truncatedDescription.value },
            { property: 'og:image', content: image.value },
            { property: 'og:url', content: canonicalUrl.value },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: title.value },
            { name: 'twitter:description', content: truncatedDescription.value },
            { name: 'twitter:image', content: image.value },
            { name: 'robots', content: noindex.value ? 'noindex' : undefined },
        ],
    }))

    return { head, image, description, title, truncatedDescription }
}

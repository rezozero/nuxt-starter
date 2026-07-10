import { joinURL } from 'ufo'
import type { RoadizAlternateLink, RoadizDocument, RoadizNodesSources, RoadizWebResponse } from '@roadiz/types'
import type { EventsApi } from '@events-api/javascript-sdk'
import type { MaybeRefOrGetter } from 'vue'
import { markdownToPlainText } from '~/utils/markdown/markdown-to-plain-text'

export async function useRoadizMeta(
    webResponse?: MaybeRefOrGetter<RoadizWebResponse | undefined>,
    alternateLinks?: MaybeRefOrGetter<RoadizAlternateLink[] | undefined>,
) {
    const nuxtApp = useNuxtApp()
    const runtimeConfig = useRuntimeConfig()
    const { data: commonContentData } = useCommonContent()
    const item = computed(() => toValue(webResponse)?.item)
    const siteName = computed(() => commonContentData.value?.head?.siteName || nuxtApp.$config.public.site.name || '')
    const { canonicalUrl } = useCurrentPageSearchParams()

    // ------------------- Noindex -------------------
    const { isActive: previewIsActive } = useRoadizPreview()
    const noindex = computed(() => (item.value as RoadizNodesSources)?.noIndex || previewIsActive.value)

    // -------------------- Title -------------------
    const { getPageTitle } = usePageTitle()
    const title = computed(() => {
        // The API should always return a meta title.
        // The meta title is set in the Roadiz back office for each page. The logic is:
        // - a custom meta title is set in the back office for the page,
        // - or the API build a meta title from the page title and the site name.
        const metaTitle = toValue(webResponse)?.head?.metaTitle

        if (metaTitle) {
            return metaTitle
        }

        // In case it doesn't returned, we fallback to the page title or name (event).
        const fallbackTitle = (item.value as RoadizNodesSources)?.title || (item.value as EventsApi.Event)?.name

        if (fallbackTitle) {
            return getPageTitle(fallbackTitle)
        }

        return ''
    })

    // -------------------- Alternate links -------------------
    const formattedAlternateLinks = computed(() => {
        return toValue(alternateLinks)
            ?.filter(alternateLink => alternateLink.url)
            .map((alternateLink: RoadizAlternateLink) => ({
                locale: alternateLink.locale!,
                href: joinURL(runtimeConfig.public.site.url, alternateLink.url!),
            }))
    })

    // ------------------- Description -------------------
    const description = computed(() => {
        const metaDescription = toValue(webResponse)?.head?.metaDescription

        // The API tries to always return a meta description.
        // @see https://docs.roadiz.io/developer/nodes-system/node_type_fields.html#meta-description-fallback-field
        if (metaDescription) {
            return metaDescription
        }

        // If the API doesn't return a meta description, we tries to find a description in the page's content.
        // For pages, the description is generally stored in the "excerpt", "introduction" or "content" field.
        // For events, the description is generally stored in the "excerpt" or "description" field.
        // We check for all of them in order of priority.
        // Be careful because an event has the excerpt field too. Then it will be used.
        const nodeDescription = (item.value as { excerpt?: string } | undefined)?.excerpt
            || (item.value as { introduction?: string } | undefined)?.introduction
            || (item.value as { content?: string } | undefined)?.content

        if (nodeDescription) {
            return markdownToPlainText(nodeDescription)
        }

        // If the page is an event, we fallback to the event's content.
        const eventDescription = (item.value as { excerpt?: string } | undefined)?.excerpt
            || (item.value as { description?: string } | undefined)?.description

        if (eventDescription) {
            return markdownToPlainText(eventDescription)
        }

        // Fallback to the meta description set in the common content (if any).
        return commonContentData.value?.head?.metaDescription
    })

    // ------------------- Share image -------------------
    const img = useImage()
    const itemImageDocument = computed(() => {
        // For pages, the image is generally stored in the "image", "images", "media" or "medias" field.
        const pageImage = (item.value as { image?: RoadizDocument[] } | undefined)?.image?.[0]
            || (item.value as { images?: RoadizDocument[] } | undefined)?.images?.[0]
            || (item.value as { media?: RoadizDocument[] } | undefined)?.media?.[0]
            || (item.value as { medias?: RoadizDocument[] } | undefined)?.medias?.[0]

        if (pageImage) {
            return pageImage
        }

        // For events, the image is stored in the "mainDocuments" or "medias" field.
        const eventImage = (item.value as { mainDocuments?: RoadizDocument[] } | undefined)?.mainDocuments?.[0]
            || (item.value as { medias?: RoadizDocument[] } | undefined)?.medias?.[0]

        if (eventImage) {
            return eventImage
        }

        return undefined
    })

    const imageDocument = computed(() => {
        const responseHead = toValue(webResponse)?.head

        // The API tries to always return a meta share image.
        // @see https://docs.roadiz.io/developer/nodes-system/node_type_fields.html#share-image-field
        if (responseHead?.shareImage) {
            return responseHead.shareImage
        }

        // If the API doesn't return a meta share image, we tries to find a share image in the page's content.
        if (itemImageDocument.value) {
            return itemImageDocument.value
        }

        // If the page doesn't have a share image, we fallback to the meta share image set
        // in the common content (if any).
        return commonContentData.value?.head?.shareImage
    })

    async function resolveMetaImage(document: RoadizDocument | null | undefined): Promise<string | undefined> {
        if (!document?.processable || !document?.relativePath) return undefined

        // On the server, nuxtApp.runWithContext() always wraps its callback's return value in a
        // Promise (unctx's callAsync is declared `async`), even though this callback is synchronous.
        // Without awaiting it, the unresolved Promise ends up as the og:image content, which
        // renders as "[object Promise]" instead of the actual URL.
        return await nuxtApp.runWithContext(() =>
            img(
                document.relativePath!,
                {
                    width: 1200,
                    crop: '1200x630',
                    quality: 70,
                },
                {
                    // @ts-expect-error The `provider` option is not well typed in the `useImage()` composable.
                    provider: 'interventionRequest',
                },
            )) as string | undefined
    }

    const resolvedImageUrl = ref<string | undefined>()

    async function resolveImage(document: RoadizDocument | null | undefined) {
        resolvedImageUrl.value = await resolveMetaImage(document)
    }

    // Resolve upfront so the first (SSR) render already has the URL available.
    await resolveImage(imageDocument.value)

    // Keep it in sync if the share image changes later without remounting this composable's caller.
    watch(imageDocument, resolveImage)

    const image = computed(() => resolvedImageUrl.value)

    return {
        title,
        description,
        image,
        siteName,
        noindex,
        canonicalUrl,
        alternateLinks: formattedAlternateLinks,
    }
}

import type { RoadizNodesSources, RoadizWebResponse } from '@roadiz/types'
import { joinURL } from 'ufo'

export function useRoadizSeoMeta(webResponse?: RoadizWebResponse) {
    const nuxtApp = useNuxtApp()
    const { data } = useCommonContent()
    const runtimeConfig = useRuntimeConfig()
    const head = webResponse?.head
    const description = head?.metaDescription || data.value?.head?.metaDescription
    const title = head?.metaTitle || data.value?.head?.metaTitle
    const siteName = data.value?.head?.siteName || nuxtApp.$config.public.site.name || ''
    const { isActive: previewIsActive } = useRoadizPreview()

    // Share image
    const img = useImage()
    const image = () => {
        const image
            = head?.shareImage?.relativePath
            // @ts-expect-error not sure the `images` property exists, but generally it does
                || head?.images?.[0]?.relativePath
            // @ts-expect-error not sure the `image` property exists, but generally it does
                || head?.image?.[0]?.relativePath
                || data.value?.head?.shareImage?.relativePath

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
            return joinURL(runtimeConfig.app.cdnUrl || runtimeConfig.public.site.url, '/images/share.jpg')
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

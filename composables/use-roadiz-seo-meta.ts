import type { RoadizNodesSources, RoadizWebResponse } from '@roadiz/types'
import { joinURL } from 'ufo'

export async function useRoadizSeoMeta(webResponse?: RoadizWebResponse) {
    const nuxtApp = useNuxtApp()
    const { data: commonContent } = await useCommonContent()
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
            // @ts-expect-error not sure the `images` property exists, but generally it does
            || head?.images?.[0]?.relativePath
            // @ts-expect-error not sure the `image` property exists, but generally it does
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

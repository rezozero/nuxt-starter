import type { VImgProps } from '~/components/molecules/VImg/VImg.vue'
import type { VPictureProps } from '~/components/molecules/VPicture/VPicture.vue'
import { pictureProps } from '#image/components/nuxt-picture'
import type { ComponentPublicInstance } from 'vue'
import NuxtImg from '#image/components/nuxt-img.mjs'
import NuxtPicture from '#image/components/nuxt-picture.mjs'

type Props = VImgProps | VPictureProps

export function useBaseImage({ props }: { props: Props }) {
    // PLACEHOLDER COLOR
    const placeholderColor = computed(
        () =>
            typeof props.placeholder === 'string' &&
            !props.placeholder.includes('.') && // assumes a placeholder with a dot (i.e. a file extension) is a file (e.g. `image.png`)
            props.placeholder,
    )
    const rootStyle = computed(() => {
        if (placeholderColor.value) return { '--v-img-placeholder': placeholderColor.value }
    })

    // LOAD
    const root = ref<typeof NuxtImg | typeof NuxtPicture | null>(null)
    const loaded = ref(false)
    const onLoad = () => {
        loaded.value = true
    }

    onMounted(() => {
        const element = root.value?.$el as HTMLImageElement | HTMLPictureElement | null

        if (!element) return

        const img =
            element.tagName === 'IMG' ? (element as HTMLImageElement) : element.querySelector<HTMLImageElement>('img')

        if (img?.complete) onLoad()
    })

    // VNODE PROPS
    const vNodeProps = computed(() => {
        const result: Partial<Props> = {}

        Object.keys(props).forEach((key) => {
            // NuxtImg placeholder remove the src attribute and replace it with a lqip URL.
            // With a color placeholder we want to keep the src attribute.
            if (key === 'placeholder' && placeholderColor.value) return

            if (key in props) {
                result[key] = props[key as keyof Props]
            }
        })

        // SIZE
        const crop = result.modifiers?.crop
        // If the image has a crop modifier, set the width and height.
        if (typeof crop === 'string' && crop.includes('x')) {
            const [width, height] = crop.split('x')

            if (width) result.width = parseInt(width)
            if (height) result.height = parseInt(height)
        }

        return result
    })

    return {
        root,
        rootStyle,
        placeholderColor,
        vNodeProps,
        loaded,
        onLoad,
    }
}

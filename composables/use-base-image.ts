import type { VImgProps } from '~/components/molecules/VImg/VImg.vue'
import type { VPictureProps } from '~/components/molecules/VPicture/VPicture.vue'
import type { SetupContext } from 'vue'

type Props = VImgProps | VPictureProps

export function useBaseImage({ props, context }: { props: Props; context: SetupContext }) {
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
    const root = ref<HTMLImageElement | HTMLPictureElement | null>(null)
    const loaded = ref(false)
    const onLoad = (event?: Event) => {
        loaded.value = true
        if (event) context.emit('load', event)
    }
    const onError = () => {
        context.emit('error')
    }

    onMounted(() => {
        if (!root.value) return

        const img =
            root.value.tagName === 'IMG'
                ? (root.value as HTMLImageElement)
                : root.value.querySelector<HTMLImageElement>('img')

        if (!img) return

        if (img.complete) {
            onLoad()
        }
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
        onError,
    }
}

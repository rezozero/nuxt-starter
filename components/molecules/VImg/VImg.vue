<script lang="ts">
import type { ExtractPropTypes } from 'vue'
import { imgProps } from '#image/components/nuxt-img'
import { NuxtImg } from '#components'

export const vImgProps = {
    ...imgProps,
    loading: {
        type: imgProps.loading.type,
        // overrides NuxtImg default value
        default: 'lazy',
    },
}

export type VImgProps = ExtractPropTypes<typeof vImgProps>

export default defineComponent({
    props: {
        ...vImgProps,
    },
    setup(props) {
        // PLACEHOLDER COLOR
        const placeholderColor = computed(
            () =>
                typeof props.placeholder === 'string' && props.placeholder.startsWith('^(#|rgb)') && props.placeholder,
        )
        const rootStyle = computed(() => {
            if (placeholderColor.value) return { '--v-img-placeholder': placeholderColor.value }
        })

        // LOAD
        const root = ref<HTMLImageElement | null>(null)
        const loaded = ref(false)
        const onLoad = () => (loaded.value = true)

        onMounted(() => {
            if (!root.value?.complete) return

            onLoad()
        })

        // PROPS
        const vNodeProps = computed(() => {
            const result: Partial<VImgProps> = {}

            Object.keys(imgProps).forEach((key) => {
                // NuxtImg placeholder remove the src attribute and replace it with a lqip URL.
                // With a color placeholder we want to keep the src attribute.
                if (key === 'placeholder' && placeholderColor.value) return

                if (key in props) {
                    result[key as keyof VImgProps] = props[key as keyof VImgProps]
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

        if (!vNodeProps.value.src) return () => null

        const $style = useCssModule()

        return () =>
            h(NuxtImg, {
                ...vNodeProps.value,
                ref: root,
                style: rootStyle.value,
                class: [$style.root, loaded.value && $style['root--loaded']],
                onLoad,
            })
    },
})
</script>

<style lang="scss" module>
.root {
    background: var(--v-img-background, var(--v-img-placeholder));

    &--loaded {
        // Remove background when image is loaded. This is useful for hiding antialiasing artifacts.
        --v-img-background: none;
    }
}
</style>

<script lang="ts">
import type { ExtractPropTypes } from 'vue'
import { imgProps } from '#image/components/nuxt-img'
import type { ImageOptions } from '@nuxt/image'
import { getInt, parseSize } from '#image'

export const vImgProps = {
    ...imgProps,
    loading: {
        type: imgProps.loading.type,
        // overrides NuxtImg default value
        default: 'lazy',
    },
    format: {
        type: imgProps.format.type,
        default: 'webp',
    },
}

export type VImgProps = ExtractPropTypes<typeof vImgProps>

export default defineComponent({
    props: {
        ...vImgProps,
    },
    setup(props, context) {
        const $style = useCssModule()
        const { vNodeProps, root, rootStyle, loaded, onLoad, onError } = useBaseImage({ props, context })

        if (!vNodeProps.value.src) return () => null

        const $img = useImage()
        const width = computed(() => parseSize(vNodeProps.value.width))
        const height = computed(() => parseSize(vNodeProps.value.height))
        const modifiers = computed<ImageOptions['modifiers']>(() => ({
            width: width.value,
            height: height.value,
            quality: getInt(vNodeProps.value.quality),
            format: vNodeProps.value.format,
            ...vNodeProps.value.modifiers,
        }))
        const options = computed<ImageOptions>(() => ({
            provider: vNodeProps.value.provider,
            preset: vNodeProps.value.preset,
            densities: vNodeProps.value.densities,
            ...modifiers.value,
        }))
        const src = computed(() =>
            $img(
                vNodeProps.value.src!,
                {
                    ...modifiers.value,
                },
                {
                    ...options.value,
                },
            ),
        )
        const responsiveImageData = computed(() => {
            return (
                (vNodeProps.value.sizes || vNodeProps.value.densities) &&
                $img.getSizes(vNodeProps.value.src!, {
                    ...options.value,
                    sizes: vNodeProps.value.sizes,
                })
            )
        })

        return () =>
            h('img', {
                src: src.value,
                srcset: responsiveImageData.value?.srcset,
                sizes: responsiveImageData.value?.sizes,
                ref: root,
                width: width.value,
                height: height.value,
                alt: vNodeProps.value.alt,
                style: rootStyle,
                class: [$style.root, loaded.value && $style['root--loaded']],
                onLoad,
                onError,
            })
    },
})
</script>

<style lang="scss" module>
.root {
    max-width: var(--v-img-max-width, 100%); // responsive image
    height: var(--v-img-height, auto); // responsive image
    background: var(--v-img-background, var(--v-img-placeholder));

    &--loaded {
        // Remove background when image is loaded. This is useful for hiding antialiasing artifacts.
        --v-img-background: none;
    }
}
</style>

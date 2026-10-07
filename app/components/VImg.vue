<script lang="ts">
import type { ImageOptions } from '@nuxt/image'
import type { ExtractPropTypes, PropType } from 'vue'

// TODO: get the Nuxt image props from the actual component instead of hardcoding them here,
// to avoid duplication and potential mismatches.
export const vImgProps = {
    // Nuxt Image v2 props (mirrors BaseImageProps + ImageProps from @nuxt/image)
    src: { type: String },
    format: { type: String },
    quality: { type: [String, Number] as PropType<string | number> },
    background: { type: String },
    fit: { type: String },
    modifiers: { type: Object as PropType<ImageOptions['modifiers']> },
    preset: { type: String },
    provider: { type: null as unknown as PropType<string> },
    sizes: { type: [String, Object] as PropType<string | Record<string, unknown>> },
    densities: { type: String },
    preload: { type: [Boolean, Object] as PropType<boolean | { fetchPriority: 'auto' | 'high' | 'low' }> },
    width: { type: [String, Number] as PropType<string | number> },
    height: { type: [String, Number] as PropType<string | number> },
    crossorigin: { type: [String, Boolean] as PropType<'anonymous' | 'use-credentials' | boolean> },
    nonce: { type: String },
    placeholder: {
        type: [Boolean, String, Number, Array] as PropType<
            boolean | string | number | [number, number, number?, number?]
        >,
    },
    // HTML img attributes
    alt: { type: String },
    loading: { type: String as PropType<'lazy' | 'eager'>, default: 'lazy' },
    decoding: { type: String as PropType<'async' | 'auto' | 'sync'> },
    longdesc: { type: String },
}

export type VImgProps = ExtractPropTypes<typeof vImgProps>

export default defineComponent({
    props: {
        ...vImgProps,
    },
    emits: ['load', 'error'],
    setup(props, context) {
        // PLACEHOLDER COLOR
        const placeholderColor = computed(
            () =>
                typeof props.placeholder === 'string'
                && !props.placeholder.includes('.') // assumes a placeholder with a dot (i.e. a file extension) is a file (e.g. `image.png`)
                && props.placeholder,
        )

        // STYLE
        const $style = useCssModule()
        const style = computed(() => ({ '--v-img-placeholder': placeholderColor.value }))

        // LOAD
        const root = ref<HTMLImageElement | null>(null)
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

            if (root.value?.complete) onLoad()
        })

        const $img = useImage()
        const parseSize = (input?: string | number): number | undefined => {
            if (typeof input === 'number') return input
            if (typeof input === 'string') {
                const n = parseInt(input, 10)
                return isNaN(n) ? undefined : n
            }
        }
        const width = computed(() => parseSize(props.width))
        const height = computed(() => parseSize(props.height))
        const modifiers = computed<ImageOptions['modifiers']>(() => ({
            ...props.modifiers,
            width: width.value,
            height: height.value,
            quality: Number(props.quality || props.modifiers?.quality) || $img.options.quality,
            format: props.format || props.modifiers?.format,
        }))
        const options = computed(() => ({
            provider: props.provider,
            preset: props.preset,
            densities: props.densities,
            modifiers: modifiers.value,
        }))
        const src = computed(() =>
            $img(
                props.src!,
                {
                    ...modifiers.value,
                },
                {
                    ...options.value,
                } as ImageOptions,
            ))
        const responsiveImageData = computed(() => {
            if (props.sizes || props.densities) {
                return ($img.getSizes(props.src!, {
                    ...options.value,
                    sizes: props.sizes,
                } as ImageOptions))
            }
            else return undefined
        })
        const internalSizes = computed(() => {
            const result = responsiveImageData.value && responsiveImageData.value.sizes

            if (result === '100vw') return // do not output sizes="100vw" as it is the default value

            return result
        })

        // @see https://github.com/nuxt/image/blob/main/src/runtime/components/nuxt-img.ts
        if (props.preload) {
            const isResponsive = responsiveImageData.value && Object.values(responsiveImageData.value).every(v => v)

            useHead({
                link: [
                    {
                        rel: 'preload',
                        as: 'image',
                        nonce: props.nonce,
                        ...(!isResponsive
                            ? { href: src.value }
                            : {
                                    href: responsiveImageData.value.src,
                                    imagesizes: responsiveImageData.value.sizes,
                                    imagesrcset: responsiveImageData.value.srcset,
                                }),
                        ...(typeof props.preload !== 'boolean' && props.preload.fetchPriority
                            ? { fetchpriority: props.preload.fetchPriority }
                            : {}),
                    },
                ],
            })
        }

        return () =>
            h('img', {
                src: src.value,
                srcset: responsiveImageData.value?.srcset,
                sizes: internalSizes.value,
                ref: root,
                width: width.value,
                height: height.value,
                alt: props.alt || '', // Always set alt (empty string), empty alt is for decorative images
                loading: props.loading,
                crossorigin: typeof props.crossorigin === 'string' ? props.crossorigin : undefined,
                decoding: props.decoding,
                longdesc: props.longdesc,
                style: style.value,
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

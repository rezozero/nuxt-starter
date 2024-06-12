<script lang="ts" setup>
import type { MaybeRefOrGetter, PropType } from 'vue'
import type { ImageOptions } from '@nuxt/image'
import type { Head } from '@unhead/schema'
import type { VPictureProps } from '~/components/molecules/VPicture/VPicture.vue'

const props = defineProps({
    media: String,
    src: String,
    srcset: String,
    format: String,
    quality: String,
    sizes: [String, Object],
    fit: String,
    width: String,
    height: String,
    modifiers: Object as PropType<Record<string, unknown>>,
    preload: {
        type: [Boolean, Object] as PropType<boolean | { fetchPriority?: 'auto' | 'high' | 'low' }>,
        default: undefined,
    },
    nonce: String,
})

const pictureProps = inject<MaybeRefOrGetter<VPictureProps>>('pictureProps')

const $img = useImage()

const options: ImageOptions = computed(() => {
    if (!pictureProps) return {}

    const picturePropsValue = toValue<VPictureProps>(pictureProps)
    const $img = useImage()

    return {
        modifiers: {
            ...picturePropsValue?.modifiers,
            ...props.modifiers,
            fit: props.fit || props.modifiers?.fit,
            quality:
                props.quality
                || props.modifiers?.quality
                || picturePropsValue?.quality
                || picturePropsValue?.modifiers?.quality
                || $img.options.quality,
        },
        width: props.width || props.modifiers?.width || picturePropsValue?.width,
        height: props.height || props.modifiers?.height || picturePropsValue?.height,
        provider: picturePropsValue?.provider,
        preset: picturePropsValue?.preset,
        sizes: props.sizes || picturePropsValue?.sizes || $img.options.screens,
    }
})

const dimensions = computed(() => {
    const crop = options.value.modifiers?.crop
    const result: number[] = [options.value.width, options.value.height]

    // If the image has a crop modifier, set the width and height.
    if (typeof crop === 'string' && crop.includes('x')) {
        const [width, height] = crop.split('x')

        if (width) result[0] = parseInt(width)
        if (height) result[1] = parseInt(height)
    }

    return result
})

const sources = computed(() => {
    if (!pictureProps) return []

    const picturePropsValue = toValue<VPictureProps>(pictureProps)
    const src = props.src || picturePropsValue.src

    if (!src) return []

    const internalFormat
        = props.format || props.modifiers?.format || picturePropsValue?.format || picturePropsValue?.modifiers?.format
    const formats = internalFormat?.split(',') || ($img.options.format?.length ? [...$img.options.format] : ['webp'])

    return formats.map((format) => {
        const { srcset, sizes } = $img.getSizes(src, {
            ...options.value,
            modifiers: {
                ...options.value?.modifiers,
                format,
            },
        })

        return {
            media: props.media,
            type: `image/${format}`,
            width: dimensions.value[0],
            height: dimensions.value[1],
            // output sizes only if it is provided, if not, the <img> will handle it
            // do not output sizes="100vw" because it is the default value
            sizes: props.sizes && sizes !== '100vw' ? sizes : undefined,
            srcset,
        }
    })
})

// @see https://github.com/nuxt/image/blob/main/src/runtime/components/nuxt-picture.ts
const picturePropsValue = pictureProps && toValue<VPictureProps>(pictureProps)
const preload = props.preload || (typeof props.preload === 'undefined' && picturePropsValue?.preload)

if (preload) {
    const link: NonNullable<Head['link']>[number] = {
        rel: 'preload',
        as: 'image',
        imagesrcset: sources.value[0].srcset,
        nonce: props.nonce,
        ...(typeof preload !== 'boolean' && preload.fetchPriority
            ? { fetchpriority: preload.fetchPriority }
            : {}),
    }

    if (sources.value?.[0]?.sizes) {
        link.imagesizes = sources.value[0].sizes
    }

    useHead({ link: [link] })
}
</script>

<template>
    <source
        v-for="(source, index) in sources"
        :key="index"
        v-bind="source"
    >
</template>

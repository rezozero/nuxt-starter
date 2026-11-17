<script lang="ts" setup>
import type { MaybeRefOrGetter, PropType } from 'vue'
import type { ImageOptions } from '@nuxt/image'
import type { ResolvableLink } from '@unhead/vue'
import type { VPictureProps } from '~/components/VPicture.vue'

const props = defineProps({
    media: String,
    src: String,
    srcset: String,
    format: String,
    quality: String,
    sizes: [String, Object],
    densities: String,
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

const options = computed(() => {
    if (!pictureProps) return {}

    const picturePropsValue = toValue<VPictureProps>(pictureProps)
    const densities = props.densities || picturePropsValue?.densities

    return {
        modifiers: {
            ...picturePropsValue?.modifiers,
            ...props.modifiers,
            width: props.width || picturePropsValue?.width,
            height: props.height || picturePropsValue?.height,
            fit: props.fit || picturePropsValue?.modifiers?.fit,
            quality:
                props.quality
                || picturePropsValue?.quality
                || picturePropsValue?.modifiers?.quality
                || $img.options.quality,
        },
        provider: picturePropsValue?.provider,
        preset: picturePropsValue?.preset,
        densities,
        // Falling back to the screens would turn a densities-only source into a `w` srcset.
        sizes: props.sizes || picturePropsValue?.sizes || (densities ? undefined : $img.options.screens),
    }
})

const dimensions = computed(() => {
    const crop = options.value.modifiers?.crop
    const result = [options.value.modifiers?.width, options.value.modifiers?.height]

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
        = props.format
            || (props.modifiers?.format as string | undefined)
            || picturePropsValue?.format
            || (picturePropsValue?.modifiers?.format as string | undefined)
    const formats = internalFormat?.split(',') || ($img.options.format?.length ? [...$img.options.format] : ['webp'])

    return formats.map((format: string) => {
        const { srcset, sizes } = $img.getSizes(src, {
            ...options.value,
            modifiers: {
                ...options.value?.modifiers,
                format,
            },
        } as ImageOptions)

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

// The browser keeps the first `<source>` that matches, but a preload fetches wherever its own `media`
// matches: each link excludes the previous sources so only one fires per viewport, for the URL the `<img>`
// will reuse.
//   <source media="(min-width: 1024px)">  →  <link media="(min-width: 1024px)">
//   <source>                              →  <link media="(not (min-width: 1024px))">
// Relies on `setup` running in document order, true on the server where the links are rendered.
const sourceMedias = inject<Array<string | undefined>>('pictureSourceMedias', [])
const previousMedias = [...sourceMedias]

sourceMedias.push(props.media)

// `and` / `not` need parenthesized operands. Media types and comma lists are not supported.
const toCondition = (media: string) => (/^\([^()]*\)$/.test(media) ? media : `(${media})`)

// `undefined`: no restriction needed; `false`: an earlier source without media always wins, no preload.
const getPreloadMedia = () => {
    if (previousMedias.includes(undefined)) return false

    const conditions = [
        ...(props.media ? [toCondition(props.media)] : []),
        ...(previousMedias as Array<string>).map(media => `(not ${toCondition(media)})`),
    ]

    return conditions.join(' and ') || undefined
}

// @see https://github.com/nuxt/image/blob/main/src/runtime/components/nuxt-picture.ts
const picturePropsValue = pictureProps && toValue<VPictureProps>(pictureProps)
const preload = props.preload || (typeof props.preload === 'undefined' && picturePropsValue?.preload)
const preloadMedia = getPreloadMedia()

if (preload && sources.value[0] && preloadMedia !== false) {
    const link: ResolvableLink = {
        rel: 'preload',
        as: 'image',
        imagesrcset: sources.value[0].srcset,
        // A browser without the format skips the link, as it skips the `<source>`.
        type: sources.value[0].type,
        nonce: props.nonce,
        ...(typeof preload !== 'boolean' && preload.fetchPriority
            ? { fetchpriority: preload.fetchPriority }
            : {}),
    }

    if (sources.value[0].sizes) {
        link.imagesizes = sources.value[0].sizes
    }

    if (preloadMedia) {
        link.media = preloadMedia
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

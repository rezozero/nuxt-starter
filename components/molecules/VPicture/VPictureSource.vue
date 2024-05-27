<script lang="ts" setup>
import type { MaybeRefOrGetter, PropType } from 'vue'
import type { ImageOptions } from '@nuxt/image'
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
    modifiers: Object as PropType<Record<string, any>>,
})

const pictureProps = inject<MaybeRefOrGetter<VPictureProps>>('pictureProps')

const $img = useImage()

const options: ImageOptions = computed(() => {
    if (!pictureProps) return {}

    const picturePropsValue = toValue<VPictureProps>(pictureProps)

    return {
        modifiers: {
            ...picturePropsValue?.modifiers,
            ...props.modifiers,
            fit: props.fit || props.modifiers?.fit,
            quality:
                props.quality ||
                props.modifiers?.quality ||
                picturePropsValue?.quality ||
                picturePropsValue?.modifiers?.quality ||
                $img.options.quality,
        },
        width: props.width || props.modifiers?.width || picturePropsValue?.width,
        height: props.height || props.modifiers?.height || picturePropsValue?.height,
        provider: picturePropsValue?.provider,
        preset: picturePropsValue?.preset,
        sizes: props.sizes,
    }
})

const size = computed(() => {
    const crop = options.value.modifiers?.crop
    const result: number[] = [options.width, options.height]

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

    const internalFormat =
        props.format || props.modifiers?.format || picturePropsValue?.format || picturePropsValue?.modifiers?.format
    const formats = internalFormat?.split(',') || ($img.options.format?.length ? [...$img.options.format] : ['webp'])

    return formats.map((format) => {
        const { srcset } = $img.getSizes(src, {
            ...options.value,
            modifiers: {
                ...options.value?.modifiers,
                format,
            },
        })

        return {
            media: props.media,
            type: `image/${format}`,
            width: size.value[0],
            height: size.value[1],
            srcset,
        }
    })
})
</script>

<template>
    <source v-for="(source, index) in sources" :key="index" v-bind="source" />
</template>

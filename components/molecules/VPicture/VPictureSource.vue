<script lang="ts" setup>
import type {MaybeRefOrGetter, PropType} from 'vue'
import type { ImageOptions } from '@nuxt/image'
import type {VPictureProps} from '~/components/molecules/VPicture/VPicture.vue'

const props = defineProps({
    media: String,
    src: String,
    srcset: String,
    format: String,
    quality: String,
    sizes: String,
    fit: String,
    width: String,
    height: String,
    modifiers: Object as PropType<Record<string, any>>,
})

const pictureVNodeProps = inject<MaybeRefOrGetter<VPictureProps>>('pictureVNodeProps')

const $img = useImage()

const options: ImageOptions = computed(() => {
    if (!pictureVNodeProps) return {}

    const vNodeProps = toValue<VPictureProps>(pictureVNodeProps)

    return {
        modifiers: {
            ...vNodeProps?.modifiers,
            ...props.modifiers,
            fit: props.fit || props.modifiers?.fit,
            quality:
                props.quality ||
                props.modifiers?.quality ||
                vNodeProps?.quality ||
                vNodeProps?.modifiers?.quality,
            format:
                props.format ||
                props.modifiers?.format ||
                vNodeProps?.format ||
                vNodeProps?.modifiers?.format,
        },
        width: props.width || props.modifiers?.width || vNodeProps?.width,
        height: props.height || props.modifiers?.height || vNodeProps?.height,
        provider: vNodeProps?.provider,
        preset: vNodeProps?.preset,
        // TODO: open issue on nuxt/image because the sizes is not into the options in the docs
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

const internalSrc = computed(() => props.src || (pictureVNodeProps && toValue<VPictureProps>(pictureVNodeProps)?.src))
const imgSizes = computed(() => internalSrc.value && $img.getSizes(internalSrc.value as string, options.value))
const internalSrcset = computed(() => imgSizes.value?.srcset)
</script>

<template>
    <source :media="media" :width="size[0]" :height="size[1]" :srcset="internalSrcset" />
</template>

<script lang="ts">
import type { ExtractPropTypes, ImgHTMLAttributes, PropType, VNode } from 'vue'
import type { VImgProps } from '~/components/VImg.vue'
import { Fragment, isVNode } from 'vue'
import pick from 'lodash/pick'
import VImg, { vImgProps } from '~/components/VImg.vue'
import VPictureSource from '~/components/VPictureSource.vue'
import { fitCrop, parseCrop } from '~/utils/image/crop'

export const vPictureProps = {
    ...vImgProps,
    // NuxtPicture v2 extra props
    legacyFormat: { type: String },
    imgAttrs: { type: Object as PropType<ImgHTMLAttributes> },
}

export type VPictureProps = ExtractPropTypes<typeof vPictureProps>

interface VPictureSourceProps {
    media?: string
    modifiers?: { crop?: string, [key: string]: unknown }
}

const parseSize = (input?: string | number) =>
    (input === undefined ? undefined : parseInt(String(input), 10) || undefined)

// Slot content reaches us wrapped in fragments (`<slot>`, `v-for`, `<template>`).
const findSourceProps = (nodes: Array<VNode>): Array<VPictureSourceProps> =>
    nodes.flatMap((node) => {
        if (node.type === VPictureSource) return [(node.props ?? {}) as VPictureSourceProps]
        if (node.type === Fragment && Array.isArray(node.children)) {
            return findSourceProps(node.children.filter(isVNode))
        }

        return []
    })

export default defineComponent({
    props: {
        ...vPictureProps,
    },
    setup(props, context) {
        // Provide props to children (<sources>)
        provide('pictureProps', props)
        // Source medias in document order, so each preloads only where it wins (see `VPictureSource`).
        provide('pictureSourceMedias', [] as Array<string | undefined>)

        const $style = useCssModule()
        // The sources preload; the `<img>` keeps only the priority, as `<source>` has no `fetchpriority`
        // and the `<img>` makes the request for whichever source wins.
        const imgFilteredProps = computed(() => ({
            ...pick(props, Object.keys(vImgProps)),
            preload: undefined,
            fetchpriority:
                props.fetchpriority || (typeof props.preload === 'object' ? props.preload.fetchPriority : undefined),
        }) as VImgProps)

        // The `<img>` takes the crop of the source without media, the one shown by default, so its
        // `src` and `width` / `height` follow the displayed format instead of the document's.
        const getCroppedImgProps = (
            sources: Array<VPictureSourceProps>,
        ): Partial<Pick<VImgProps, 'width' | 'height' | 'modifiers'>> => {
            const source = sources.find(source => !source.media)
            const crop = source?.modifiers?.crop ?? props.modifiers?.crop
            const cropRatio = parseCrop(crop)
            const dimensions = cropRatio && fitCrop(cropRatio, parseSize(props.width), parseSize(props.height))

            if (!dimensions) return {}

            return {
                width: dimensions[0],
                height: dimensions[1],
                modifiers: { ...props.modifiers, crop },
            }
        }

        return () => {
            const sources = context.slots.default?.() || [h(VPictureSource)]

            return h('picture', { class: $style.root }, [
                sources,
                h(VImg, {
                    ...imgFilteredProps.value,
                    ...getCroppedImgProps(findSourceProps(sources)),
                    ...props.imgAttrs,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any),
            ])
        }
    },
})
</script>

<style lang="scss" module>
.root {
    display: var(--v-picture-display, fit-content);
}
</style>

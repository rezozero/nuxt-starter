<script lang="ts">
import type { RoadizDocument } from '@roadiz/types'
import type { PropType } from 'vue'
import pick from 'lodash/pick'
import interventionRequestProps from '~/utils/image/intervention-request-props'
import { LazyVCopyright, VImg, VPicture } from '#components'
import { imgProps } from '#image/components/NuxtImg.vue'
import { pictureProps } from '#image/components/NuxtPicture.vue'

export const vRoadizImageProps = {
    ...imgProps,
    ...pictureProps,
    ...interventionRequestProps,
    document: [Array, Object] as PropType<RoadizDocument | RoadizDocument[]>,
    tag: String as PropType<'picture' | 'img'>,
    copyright: [String, Boolean],
}

type InterventionRequestProps = typeof interventionRequestProps
type InterventionRequestPropsKeys = keyof InterventionRequestProps

export default defineComponent({
    props: vRoadizImageProps,
    setup(props, { slots }) {
        const $style = useCssModule()
        const document = computed(() => (Array.isArray(props.document) ? props.document[0] : props.document))
        const modifiers = computed(() => {
            const result = pick<Writeable<typeof props>, InterventionRequestPropsKeys>(
                props,
                Object.keys(interventionRequestProps) as Array<InterventionRequestPropsKeys>,
            )
            // Add hotspot modifier
            const hotspot = props.hotspot || document.value?.hotspot

            if (hotspot) {
                if (typeof hotspot === 'string') {
                    result.hotspot = hotspot
                }
                else if ('x' in hotspot && 'y' in hotspot) {
                    result.hotspot = `${hotspot.x}:${hotspot.y}`

                    if (
                        'areaStartX' in hotspot
                        && 'areaStartY' in hotspot
                        && 'areaEndX' in hotspot
                        && 'areaEndY' in hotspot
                    ) {
                        result.hotspot += `:${hotspot.areaStartX}:${hotspot.areaStartY}:${hotspot.areaEndX}:${hotspot.areaEndY}`

                        if (
                            !props.crop
                            && document.value?.imageWidth
                            && document.value?.imageHeight
                            && hotspot.areaStartX
                            && hotspot.areaEndX
                            && hotspot.areaStartY
                            && hotspot.areaEndY
                        )
                            result.crop = `${Math.floor(document.value?.imageWidth * (hotspot.areaEndX - hotspot.areaStartX))}x${Math.floor(document.value?.imageHeight * (hotspot.areaEndY - hotspot.areaStartY))}`
                    }
                }
            }
            else if (!props.align && document.value?.imageCropAlignment) {
                // It should not be imageCropAlignment and hotspot at the same time
                result.align = document.value?.imageCropAlignment
            }

            return result
        })
        const cropDimensions = computed(() => modifiers.value?.crop?.split('x') || [])
        const width = computed(() => cropDimensions.value[0] || props?.width || document.value?.imageWidth)
        const height = computed(() => cropDimensions.value[1] || props?.height || document.value?.imageHeight)
        const isPicture = computed(() => !!slots.default || props.tag === 'picture')
        const copyright = computed(
            () =>
                (typeof props.copyright === 'string' && props.copyright)
                || (props.copyright === true && document.value?.copyright),
        )
        const $img = useImage()
        const imageComponentProps = computed(() => {
            return {
                ...pick(props, Object.keys(isPicture.value ? pictureProps : imgProps)),
                src: document.value?.thumbnail?.relativePath || document.value?.relativePath,
                width: width.value,
                height: height.value,
                alt: document.value?.alt || '', // Always set alt (empty string), empty alt is for decorative images
                placeholder: document.value?.imageAverageColor,
                format: props.format || 'webp',
                sizes:
                    props.sizes
                    || (!isPicture.value
                        && !props.densities
                        && ($img.options.presets?.default?.sizes || $img.options.screens))
                    || undefined,
                provider: 'interventionRequest',
                modifiers: {
                    ...modifiers.value,
                    format: props.format || 'webp',
                },
            }
        })
        const imageComponent = h(isPicture.value ? VPicture : VImg, imageComponentProps.value, slots.default)

        return () => {
            if (copyright.value) {
                // The copyright needs a wrapper element.
                return h('figure', { class: [$style.root, $style['root--copyright']] }, [
                    imageComponent,
                    h(LazyVCopyright, { content: copyright.value }),
                ])
            }

            return imageComponent
        }
    },
})
</script>

<style lang="scss" module>
.root {
    &--copyright {
        position: relative;
    }
}
</style>

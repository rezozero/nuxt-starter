<script lang="ts">
import type { RoadizDocument } from '@roadiz/types'
import type { PropType } from 'vue'
import interventionRequestProps from '~/utils/image/intervention-request-props'
import { LazyVCopyright, VImg, VPicture } from '#components'
import { imgProps } from '#image/components/nuxt-img'
import { pictureProps } from '#image/components/nuxt-picture'
import pick from 'lodash/pick'

export const vRoadizImageProps = {
    ...imgProps,
    ...pictureProps,
    ...interventionRequestProps,
    document: [Array, Object] as PropType<RoadizDocument | RoadizDocument[]>,
    tag: String as PropType<'picture' | 'img'>,
    copyright: [String, Boolean],
}

export default defineComponent({
    props: vRoadizImageProps,
    setup(props, { slots }) {
        const $style = useCssModule()
        const document = computed(() => (Array.isArray(props.document) ? props.document[0] : props.document))
        const modifiers = computed(() => {
            const result = pick<typeof props, keyof typeof interventionRequestProps>(
                props,
                Object.keys(interventionRequestProps) as keyof typeof interventionRequestProps,
            )

            if (document.value?.imageCropAlignment && !result.align) {
                result.align = document.value!.imageCropAlignment
            }

            return result
        })
        const cropDimensions = computed(() => modifiers.value?.crop?.split('x') || [])
        const width = computed(() => cropDimensions.value[0] || props?.width || document.value?.imageWidth)
        const height = computed(() => cropDimensions.value[1] || props?.height || document.value?.imageHeight)
        const isPicture = computed(() => !!slots.default || props.tag === 'picture')
        const copyright = computed(
            () =>
                (typeof props.copyright === 'string' && props.copyright) ||
                (props.copyright === true && document.value?.copyright),
        )
        const $img = useImage()
        const imageComponentProps = computed(() => {
            return {
                ...pick(props, Object.keys(isPicture.value ? pictureProps : imgProps)),
                src: document.value?.thumbnail?.relativePath || document.value?.relativePath,
                width: width.value,
                height: height.value,
                alt: document.value?.alt || document.value?.name,
                placeholder: document.value?.imageAverageColor,
                format: props.format || 'webp',
                sizes:
                    props.sizes ||
                    (!isPicture.value &&
                        !props.densities &&
                        ($img.options.presets?.default?.sizes || $img.options.screens)) ||
                    undefined,
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

<script lang="ts">
import type { RoadizDocument } from '@roadiz/types'
import type { PropType } from 'vue'
import interventionRequestProps from '~/utils/image/intervention-request-props'
import { LazyVCopyright, VImg, VPicture } from '#components'
import { extractInterventionRequestModifiers } from '~/utils/image/extract-intervention-request-modifiers'

export const vRoadizImageProps = {
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
            const result = extractInterventionRequestModifiers(props)

            if (document.value?.imageCropAlignment && !result.align) {
                result.align = document.value!.imageCropAlignment
            }

            return result
        })
        const cropDimensions = computed(() => modifiers.value?.crop?.split('x') || [])
        const width = computed(() => cropDimensions.value[0] || props?.width || document.value?.imageWidth)
        const height = computed(() => cropDimensions.value[1] || props?.height || document.value?.imageHeight)
        const documentProps = computed(() => {
            return {
                src: document.value?.thumbnail?.relativePath || document.value?.relativePath,
                width: width.value,
                height: height.value,
                alt: document.value?.alt || document.value?.name,
                placeholder: document.value?.imageAverageColor,
                description: document.value?.description,
                copyright: document.value?.copyright,
                provider: 'interventionRequest',
            }
        })

        const isPicture = computed(() => slots.default || props.tag === 'picture')

        const imageComponent = h(
            isPicture ? VPicture : VImg,
            {
                ...documentProps.value,
                modifiers: modifiers.value,
            },
            isPicture ? slots.default : undefined,
        )

        const copyright = computed(() =>
            (typeof props.copyright === 'string' && props.copyright) ||
            (props.copyright === true && document.value?.copyright))

        // return () => h(copyright.value ? 'figure' : imageComponent, {
        //         class: [$style.root, copyright.value && $style['root--copyright']]
        //     }, copyright.value ? [
        //             imageComponent,
        //             h(LazyVCopyright, [copyright.value]),
        // ] : [])

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

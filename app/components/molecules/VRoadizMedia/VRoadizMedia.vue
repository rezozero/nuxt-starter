<script lang="ts">
import type { VRoadizImage, VRoadizVideo } from '#components'
import { LazyVRoadizAudio, LazyVRoadizImage, LazyVRoadizVideo } from '#components'
import type { RoadizDocument } from '@roadiz/types'
import { type Component, h, type PropType } from 'vue'
import { isAudio, isImage, isPDF, isVideo } from '~/utils/roadiz/document'

type VVideoProps = InstanceType<typeof VRoadizVideo>['$props']
type VImageProps = InstanceType<typeof VRoadizImage>['$props']

export default defineComponent({
    props: {
        document: { type: Object as PropType<RoadizDocument>, required: true },
        image: Object as PropType<VImageProps>,
        video: Object as PropType<Omit<VVideoProps, 'document'>>,
        placeholder: Boolean,
    },
    setup(props, { slots }) {
        const displayedDocument = computed(() => {
            return isPDF(props.document) ? props.document?.thumbnail : props.document
        })

        const mediaType = computed(() => {
            const displayImgTag = isImage(displayedDocument.value) || isPDF(displayedDocument.value)

            if (isVideo(displayedDocument.value)) return 'video'
            else if (isAudio(displayedDocument.value)) return 'audio'
            else if (displayImgTag) return 'image'
            else if (props.placeholder) return 'placeholder'

            return undefined
        })

        // Node data
        const tag = computed(() => {
            if (mediaType.value === 'video') {
                return LazyVRoadizVideo
            }
            else if (mediaType.value === 'image') {
                return LazyVRoadizImage
            }
            else if (mediaType.value === 'audio') {
                return LazyVRoadizAudio
            }
            else if (mediaType.value === 'placeholder') {
                return 'div'
            }

            return undefined
        })

        if (!tag.value) return () => h('')

        const nodeProps = computed(() => {
            const result = { document: displayedDocument.value }

            if (mediaType.value === 'video') {
                Object.assign(result, props.video)
                Object.assign(result, { thumbnail: props.image })
            }
            else if (mediaType.value === 'image') {
                Object.assign(result, props.image)
            }

            return result
        })

        return () => h(tag.value as Component | string, nodeProps.value, slots)
    },
})
</script>

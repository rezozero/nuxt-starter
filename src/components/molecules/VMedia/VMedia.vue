<script lang="ts">
import Vue from 'vue'
import type { PropType, VNode, VNodeData } from 'vue'
import { RoadizDocument } from '@roadiz/abstract-api-client/dist/types/roadiz'
import { isAudio, isImage, isVideo } from '~/utils/roadiz/document'
import VVideo, { VVideoProps } from '~/components/molecules/VVideo/VVideo.vue'
import VImage, { VImageProps } from '~/components/molecules/VImage/VImage.vue'
import VAudio from '~/components/molecules/VAudio/VAudio.vue'

export default Vue.extend({
    name: 'VMedia',
    functional: true,
    props: {
        document: Object as PropType<RoadizDocument>,
        image: Object as PropType<VImageProps>,
        video: Object as PropType<VVideoProps>,
    },
    render(createElement, context): VNode {
        const { props } = context
        const data: VNodeData = {
            ...context.data,
            class: context.data.class,
            props: context.props,
        }
        const document = props.document
        const tag = isVideo(document) ? VVideo : isAudio(document) ? VAudio : isImage(document) ? VImage : ''

        if (isVideo(document)) {
            data.props = {
                ...data.props,
                ...props.video,
                posterProps: props.image,
                document,
            } as VVideoProps
        } else if (isImage(document)) {
            data.props = {
                ...data.props,
                ...props.image,
                image: document,
            } as VImageProps
        }

        return createElement(tag, data)
    },
})
</script>

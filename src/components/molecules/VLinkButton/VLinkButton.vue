<script lang="ts">
import Vue from 'vue'
import type { PropType, VNode } from 'vue'
import { RoadizDocument, RoadizNodesSources } from '@roadiz/abstract-api-client/dist/types/roadiz'
import VButton from '~/components/molecules/VButton/VButton.vue'
import VLink from '~/components/molecules/VLink/VLink.vue'
import { EventsApi } from '~/types/event'

export default Vue.extend({
    name: 'VLinkButton',
    functional: true,
    props: {
        label: [String, Boolean],
        reference: [Array, Object] as PropType<RoadizNodesSources[] | EventsApi.Event>,
        url: String,
        document: Array as PropType<RoadizDocument[]>,
        component: String,
    },
    render(createElement, context): VNode {
        return createElement(VLink, {
            props: {
                ...context.props,
                custom: true,
            },
            scopedSlots: {
                default: (props) => {
                    if (!props?.label && !context.slots()?.icon) return createElement('')

                    return createElement(context.props.component || VButton, {
                        ...context.data,
                        props,
                        staticClass: props.staticClass,
                    })
                },
            },
        })
    },
})
</script>

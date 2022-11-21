<script lang="ts">
import Vue from 'vue'
import type { PropType, VNode, VNodeData } from 'vue'
import { RoadizDocument, RoadizNodesSources } from '@roadiz/abstract-api-client/dist/types/roadiz'
import VueI18n from 'vue-i18n'
import { RenderContext } from 'vue/types/options'
import { EventsApi } from '~/types/event'

type Reference = RoadizNodesSources | EventsApi.Event

function getDefaultLabel(context: RenderContext, label: string): VueI18n.TranslateResult | false {
    return context.parent.$te(label) && context.parent.$t(label)
}

export default Vue.extend({
    name: 'VLink',
    functional: true,
    props: {
        label: {
            type: [String, Boolean],
            default: undefined,
        },
        reference: [Array, Object] as PropType<Reference[] | Reference>,
        url: String,
        document: Array as PropType<RoadizDocument[]>,
        custom: Boolean, // use scoped slot
    },
    render(createElement, context): VNode | VNode[] {
        const reference =
            context.props.reference && Array.isArray(context.props.reference)
                ? context.props.reference[0]
                : context.props.reference
        const document = context.props.document?.[0]
        const url = context.props.url

        if (!url && !document && !reference) {
            return (
                context.scopedSlots.default?.({ label: context.props.label }) ||
                context.slots()?.default ||
                (context.props.label && createElement('span', [context.props.label])) ||
                createElement('')
            )
        }

        const data: VNodeData = Object.assign({}, context.data)
        const isInternal = !!reference || url?.charAt(0) === '/' || url?.charAt(0) === '#'
        const isExternal = !isInternal && !!url
        const isDownload = !isInternal && !isExternal && !!document

        if (!data.props) data.props = {}
        if (!data.attrs) data.attrs = {}

        let label: string | VueI18n.TranslateResult | undefined | boolean = context.props.label
        let href!: string
        let target!: string
        let rel!: string
        let to!: string
        let staticClass!: string

        if (!label && label !== false) {
            if (isExternal) {
                label = getDefaultLabel(context, 'link.external_default_label') || url
            } else if (isInternal) {
                label =
                    getDefaultLabel(context, 'link.internal_default_label') ||
                    (reference as RoadizNodesSources)?.title ||
                    (reference as EventsApi.Event)?.name ||
                    url
            } else if (isDownload) {
                label = getDefaultLabel(context, 'link.download_default_label') || document.alt || document.filename
            }
        }

        if (isDownload) {
            href = context.parent.$documentURL(document.relativePath)
            target = '_blank'
            rel = 'noopener'
            // staticClass = 'matomo_download'
        } else if (isInternal) {
            to = reference?.url || url
        } else if (isExternal) {
            href = url
            target = '_blank'
            rel = 'noopener'
        }

        if (context.props.custom) {
            const vNodes = context.scopedSlots.default?.({
                label,
                href,
                target,
                rel,
                to,
                staticClass,
            })

            if (vNodes && !vNodes?.[0]?.text) {
                return vNodes
            }
        }

        if (!href && !to) {
            return context.slots()?.default || (label ? createElement('span', String(label)) : createElement(''))
        }

        return createElement(
            isExternal || isDownload ? 'a' : 'nuxt-link',
            {
                ...context.data,
                staticClass,
                attrs: {
                    ...context.data.attrs,
                    rel,
                    href,
                    target,
                },
                props: {
                    to,
                },
            },
            context.slots()?.default || (label && String(label)) || ''
        )
    },
})
</script>

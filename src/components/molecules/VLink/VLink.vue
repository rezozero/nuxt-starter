<script lang="ts">
import Vue from 'vue'
import type { PropType, VNode, VNodeData } from 'vue'
import { RoadizDocument, RoadizNodesSources } from '@roadiz/abstract-api-client/dist/types/roadiz'
import VueI18n from 'vue-i18n'
import { RenderContext } from 'vue/types/options'
import { EventsApi } from '~/types/event'

export type Reference = RoadizNodesSources | EventsApi.Event

type CustomVNodeData = VNodeData & Required<Pick<VNodeData, 'props' | 'attrs'>>

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

        const data: CustomVNodeData = Object.assign({ props: {}, attrs: {} }, context.data)
        const isRelative = url?.charAt(0) === '/'
        const isInternal = (!!reference || isRelative || url?.charAt(0) === '#') && !context.data.attrs?.target
        const isExternal = !isInternal && !!url
        const isDownload = !isInternal && !isExternal && !!document
        let label: string | VueI18n.TranslateResult | undefined | boolean = context.props.label

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
            data.attrs = {
                ...data.attrs,
                href: context.parent.$documentURL(document.relativePath),
                target: '_blank',
                rel: 'noopener',
            }
        } else if (isInternal) {
            data.props.to = reference?.url || url
        } else if (isExternal) {
            data.attrs = {
                ...data.attrs,
                href: url,
                target: context.data.attrs?.target || '_blank',
                rel: !isRelative && 'noopener',
            }
        }

        if (context.props.custom) {
            const vNodes = context.scopedSlots.default?.({
                label,
                href: data.attrs.href,
                target: data.attrs.target,
                rel: data.attrs.target,
                to: data.props.to,
                staticClass: data.staticClass,
            })

            if (vNodes && !vNodes?.[0]?.text) {
                return vNodes
            }
        }

        if (!data.attrs!.href && !data.props!.to) {
            return context.slots()?.default || (label ? createElement('span', String(label)) : createElement(''))
        }

        return createElement(
            isExternal || isDownload ? 'a' : 'nuxt-link',
            data,
            context.slots()?.default || (label && String(label)) || ''
        )
    },
})
</script>

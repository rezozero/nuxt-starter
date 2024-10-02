<script lang="ts">
import type { RoadizDocument } from '@roadiz/types'
import { h, type PropType } from 'vue'
import type { NuxtLinkProps } from '#app/components/nuxt-link'
import { NuxtLink } from '#components'
import type { ReachableItem } from '~/types/app'
import { isInternalUrl } from '~/utils/url'

export const vRoadizLinkProps = {
    label: [String, Boolean],
    reference: [Array, Object] as PropType<ReachableItem[] | ReachableItem>,
    url: String,
    document: Object as PropType<RoadizDocument>,
    nuxtLinkProps: Object as PropType<NuxtLinkProps>,
    custom: Boolean, // use scoped slot
}

export default defineComponent({
    inheritAttrs: false,
    props: vRoadizLinkProps,
    setup(props, { attrs, slots }) {
        const reference = props.reference && Array.isArray(props.reference) ? props.reference[0] : props.reference
        const url = props.url || reference?.url
        const runtimeConfig = useRuntimeConfig()
        const siteUrl = runtimeConfig?.public?.site.url

        const isInternal = isInternalUrl(url, siteUrl)
        const isExternal = !isInternal && !!url
        const isDownload = !isInternal && !isExternal && !!props.document

        // A VRoadizLink without URL or reference will render nothing except the default slot if present, fallback to the label, or at least nothing
        if (!url && !props.document?.relativePath) {
            return () =>
                slots.default?.({ label: props.label })
                || (typeof props.label === 'string' && h('span', attrs, props.label))
                || null
        }

        // Define attributes
        const attributes = { ...attrs, ...props.nuxtLinkProps }

        if (isDownload || isExternal) {
            Object.assign(attributes, {
                target: attrs?.target || '_blank',
                rel: attrs?.rel || 'noopener',
            })
        }

        if (isDownload) {
            Object.assign(attributes, { href: useRoadizDocumentUrl(props.document?.relativePath) })
        }
        else if (isInternal) {
            // Prevent NuxtLink to add rel attrs if it is absolute internal url
            Object.assign(attributes, { to: url?.replace(siteUrl, '') })
        }
        else if (isExternal) {
            Object.assign(attributes, { href: props.url })
        }

        // Custom VRoadizLink will pass all attributes to the default slot and render it (i.e. render-less component behavior)
        if (props.custom) {
            const vNode = slots.default?.({
                download: isDownload ? '' : undefined,
                ...attributes,
            })

            if (vNode?.length) return () => vNode[0]
        }

        // By default return a NuxtLink component
        return () =>
            h(NuxtLink, attributes, slots.default || (() => (typeof props.label === 'string' && props.label) || ''))
    },
})
</script>

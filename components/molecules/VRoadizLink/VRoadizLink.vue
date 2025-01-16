<script lang="ts">
import type { RoadizDocument, RoadizNodesSources } from '@roadiz/types'
import { h, type PropType } from 'vue'
import type { NuxtLinkProps } from '#app/components/nuxt-link'
import { NuxtLink } from '#components'

export const vRoadizLinkProps = {
    label: [String, Boolean],
    reference: [Array, Object] as PropType<RoadizNodesSources[] | RoadizNodesSources>,
    url: String,
    document: Object as PropType<RoadizDocument>,
    nuxtLinkProps: Object as PropType<NuxtLinkProps>,
    custom: Boolean, // use scoped slot
}

export default defineComponent({
    inheritAttrs: false,
    props: vRoadizLinkProps,
    setup(props, { attrs, slots }) {
        const reference = computed(() => {
            if (!props.reference) return

            return Array.isArray(props.reference) ? props.reference[0] : props.reference
        })

        const runtimeConfig = useRuntimeConfig()
        const siteUrl = runtimeConfig?.public?.site.url

        const attributes = computed<Record<string, unknown>>(() => {
            const defaultAttrs = { ...attrs, ...props.nuxtLinkProps }

            // Download
            if (props.document?.relativePath) {
                return {
                    ...defaultAttrs,
                    href: useRoadizDocumentUrl(props.document?.relativePath),
                    target: attrs?.target || '_blank',
                    rel: attrs?.rel || 'noopener noreferrer',
                    download: '',
                }
            }

            // External link
            if (props.url && isExternalUrl(props.url, siteUrl)) {
                return {
                    ...defaultAttrs,
                    href: props.url,
                    target: attrs?.target || '_blank',
                    rel: attrs?.rel || 'noopener noreferrer',
                }
            }

            // Internal link
            const internalUrl = props.url && isInternalURL(props.url, siteUrl) ? props.url : reference.value?.url && isInternalURL(reference.value.url, siteUrl) ? reference.value.url : undefined

            if (internalUrl) {
                // Prevent NuxtLink to add rel attrs if it is absolute internal url
                return {
                    ...defaultAttrs,
                    to: internalUrl?.replace(siteUrl, ''), // Force relative path
                }
            }

            // Other kind of links (mailto, tel, javascript, etc.)
            if (props.url) {
                return {
                    ...defaultAttrs,
                    to: props.url,
                }
            }

            return defaultAttrs
        })

        return () => {
            if (props.custom) {
                // Custom VRoadizLink will pass all attributes to the default slot
                // and render it (i.e. render-less component behavior)
                return slots.default?.(attributes.value)
            }

            return h(NuxtLink, attributes.value, slots.default || (() => (typeof props.label === 'string' && props.label) || ''))
        }
    },
})
</script>

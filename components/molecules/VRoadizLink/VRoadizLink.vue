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
        const reference = computed(() => {
            if (!props.reference) return
            return Array.isArray(props.reference) ? props.reference[0] : props.reference
        })

        const url = computed(() => {
            return props.url || reference.value?.url || props.document?.relativePath
        })

        const runtimeConfig = useRuntimeConfig()
        const siteUrl = runtimeConfig?.public?.site.url

        const isInternal = computed(() => isInternalUrl(url.value, siteUrl))
        const isExternal = computed(() => !!url.value && !isInternal.value)
        const isDownload = computed(() => !!url.value && !isExternal.value && !!props.document?.relativePath)

        const attributes = computed(() => {
            const mergedAttrs = { ...attrs, ...props.nuxtLinkProps }
            if (!url.value) return mergedAttrs

            if (isDownload.value) {
                Object.assign(mergedAttrs, {
                    href: useRoadizDocumentUrl(props.document?.relativePath),
                    target: attrs?.target || '_blank',
                    rel: attrs?.rel || 'noopener',
                    download: '',
                })
            }
            else if (isExternal.value) {
                Object.assign(mergedAttrs, {
                    href: props.url,
                    target: attrs?.target || '_blank',
                    rel: attrs?.rel || 'noopener',
                })
            }
            else if (isInternal.value) {
                // Prevent NuxtLink to add rel attrs if it is absolute internal url
                Object.assign(mergedAttrs, {
                    to: url.value?.replace(siteUrl, ''), // Force relative path
                })
            }

            return mergedAttrs
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

<script lang="ts">
import Vue from 'vue'
import type { VNode, PropType } from 'vue'
import { JsonLdObject } from '@roadiz/abstract-api-client/dist/types/jsonld'
import { getStructuredData } from '~/utils/seo/get-structured-data'

export default Vue.extend({
    name: 'VStructuredData',
    functional: true,
    props: {
        data: Object as PropType<JsonLdObject>,
        properties: [String, Array] as PropType<string | string[]>,
    },
    render(createElement, context): VNode {
        const structuredData = getStructuredData(context.props.data, context.parent.$nuxt, context.props.properties)

        if (!structuredData) return createElement('')

        return createElement('script', {
            ...context.data,
            attrs: {
                ...context.data.attrs,
                type: 'application/ld+json',
            },
            domProps: {
                innerHTML: JSON.stringify(structuredData),
            },
        })
    },
})
</script>

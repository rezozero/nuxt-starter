<script lang="ts">
import type { PropType, VNode } from 'vue'
import Vue from 'vue'
import { RoadizWalker } from '@roadiz/abstract-api-client/dist/types/roadiz'

export default Vue.extend({
    name: 'VBlockFactory',
    functional: true,
    props: {
        blocks: {
            type: Array as PropType<RoadizWalker[]>,
            default: () => [],
        },
    },
    render(createElement, context): VNode[] | VNode {
        const { blocks } = context.props
        const registeredComponents = blocks?.filter(
            (block: RoadizWalker) =>
                context.parent.$root.$options.components &&
                block.item['@type'] in context.parent.$root.$options.components
        )

        if (!registeredComponents?.length) return createElement('div') // fix DOM mismatch without blocks or corresponding components

        return registeredComponents.map((block, index, blocks) => {
            return createElement(block.item['@type'], {
                props: {
                    walker: block,
                    index,
                    numBlocks: blocks.length,
                },
                attrs: {
                    ...context.data.attrs,
                    id: block.item.slug,
                },
                on: context.listeners,
            })
        })
    },
})
</script>

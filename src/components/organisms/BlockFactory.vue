<script lang="ts">
import Vue, { PropType, VNode } from 'vue'
import { RoadizWalker } from '@roadiz/abstract-api-client/dist/types/roadiz'

export default Vue.extend({
    name: 'BlockFactory',
    functional: true,
    props: {
        blocks: {
            type: Array as PropType<RoadizWalker[]>,
            default: () => [],
        },
    },
    render(createElement, context): VNode {
        return createElement(
            // TODO: use directly an array of VNode
            'div',
            {
                attrs: { class: 'block-factory' },
            },
            context.props.blocks
                .filter(
                    (block: RoadizWalker) =>
                        context.parent.$root.$options.components &&
                        block.item['@type'] in context.parent.$root.$options.components
                )
                .map((block, index, blocks) => {
                    return createElement(block.item['@type'], {
                        props: {
                            walker: block,
                            index,
                            numBlocks: blocks.length,
                        },
                        attrs: {
                            id: block.item.node.nodeName,
                        },
                        // on: {
                        //     [EventType.BLOCK_MOUNTED]() {
                        //         // TODO: transform the event name to pascal case automatically
                        //         const callback = context.listeners['block-mounted']
                        //
                        //         if (typeof callback === 'function') callback()
                        //     },
                        // },
                    })
                })
        )
    },
})
</script>

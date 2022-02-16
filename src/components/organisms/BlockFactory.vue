<script lang="ts">
import Vue, { PropType, VNode } from 'vue'
import { RoadizWalker } from '@roadiz/abstract-api-client/dist/types/roadiz'
import { HydraCollection } from '@roadiz/abstract-api-client/dist/types/hydra'
import { JsonLdObject } from '@roadiz/abstract-api-client/dist/types/jsonld'
import EventType from '~/constants/event-type'

export default Vue.extend({
    name: 'BlockFactory',
    functional: true,
    props: {
        blocks: {
            type: [Object, Array] as PropType<
                HydraCollection<RoadizWalker> | Array<Exclude<RoadizWalker, JsonLdObject>>
            >,
            default: () => [],
        },
    },
    render(createElement, context): VNode[] | VNode {
        const blocks = Array.isArray(context.props.blocks) ? context.props.blocks : context.props.blocks['hydra:member']

        if (!blocks.length) return createElement('div') // fix DOM mismatch without blocks

        return blocks
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
                    on: {
                        [EventType.BLOCK_MOUNTED]() {
                            // TODO: transform the event name to pascal case automatically
                            const callback = context.listeners['block-mounted']

                            if (typeof callback === 'function') callback()
                        },
                    },
                })
            })
    },
})
</script>

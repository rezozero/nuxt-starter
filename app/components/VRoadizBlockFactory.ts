import type { ExtractPropTypes, FunctionalComponent, VNodeChild } from 'vue'
import { h, resolveDynamicComponent, resolveComponent } from 'vue'
import type { RoadizWalker } from '@roadiz/types'

const props = {
    prefix: String,
    blocks: {
        type: Array as () => RoadizWalker[],
        required: true as const,
    },
}

export type RoadizBlockFactoryProps = ExtractPropTypes<typeof props>

const isComponent = (component: string | undefined): boolean => {
    return typeof resolveDynamicComponent(component) !== 'string'
}

const RoadizBlockFactory: FunctionalComponent<RoadizBlockFactoryProps> = ({ blocks, prefix }, context): VNodeChild => {
    const blocksWithComponent = blocks.filter((block) => {
        const componentName = prefix
            ? prefix + block.item?.['@type']?.replace(/NS([a-zA-Z]+)/g, '$1')
            : block.item?.['@type']?.replace(/NS([a-zA-Z]+)/g, '$1')

        return isComponent(componentName)
    })
    return blocksWithComponent.map((block, index, blocks) => {
        const componentName = prefix
            ? prefix + block.item?.['@type']?.replace(/NS([a-zA-Z]+)/g, '$1')
            : block.item?.['@type']?.replace(/NS([a-zA-Z]+)/g, '$1')

        if (componentName) {
            return h(resolveComponent(componentName), {
                walker: block,
                index,
                numBlocks: blocks.length,
                ...context.attrs,
            })
        }
    })
}

RoadizBlockFactory.props = props

export default RoadizBlockFactory

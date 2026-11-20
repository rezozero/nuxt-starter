import type { Component, ExtractPublicPropTypes, FunctionalComponent, PropType, VNodeChild } from 'vue'
import { defineAsyncComponent, h, hydrateOnVisible, resolveDynamicComponent, resolveComponent } from 'vue'
import type { RoadizWalker } from '@roadiz/types'

export interface RoadizBlockFactoryExcludeContext {
    block: RoadizWalker
    index: number
    componentName: string
}

// A block hydrating with the app anyway: its component name, or a predicate
export type RoadizBlockFactoryExcludeRule = string | ((context: RoadizBlockFactoryExcludeContext) => boolean)

export type RoadizBlockFactoryExclude = RoadizBlockFactoryExcludeRule | RoadizBlockFactoryExcludeRule[]

export interface RoadizBlockFactoryLazyHydration {
    exclude?: RoadizBlockFactoryExclude
}

const isBlockExcluded = (
    exclude: RoadizBlockFactoryExclude | undefined,
    context: RoadizBlockFactoryExcludeContext,
): boolean => {
    const rules = Array.isArray(exclude) ? exclude : [exclude]

    return rules.some(rule => typeof rule === 'function' ? rule(context) : rule === context.componentName)
}

const props = {
    prefix: String,
    blocks: {
        type: Array as () => RoadizWalker[],
        required: true as const,
    },
    // Opt-in: hydrate each block only when it nears the viewport.
    // A block fetching data in its setup hydrates once `nuxtApp.isHydrating` is false: its `getCachedData`
    // must read the SSR payload, or the data is fetched again (see `VForm`).
    // Keep it off for blocks rendering their own children (FAQ, tabs…):
    // a child updated by its parent before being hydrated is never hydrated.
    lazyHydration: {
        type: [Boolean, Object] as PropType<boolean | RoadizBlockFactoryLazyHydration>,
        default: false,
    },
}

export type RoadizBlockFactoryProps = ExtractPublicPropTypes<typeof props>

// One wrapper per block, so the vnode type stays the same across renders (a new one would remount the block)
const lazyHydratedBlocks = new Map<string, Component>()

// The template `hydrate-on-visible` prop and `defineLazyHydrationComponent()` are compile-time only,
// so they cannot wrap a block resolved by name. This is the Vue API they both rely on.
// The global block is itself an async component: its chunk is fetched only when it hydrates, as it nears the viewport.
const getLazyHydratedBlock = (componentName: string, component: Component): Component => {
    let lazyHydratedBlock = lazyHydratedBlocks.get(componentName)

    if (!lazyHydratedBlock) {
        lazyHydratedBlock = defineAsyncComponent({
            loader: () => Promise.resolve(component),
            hydrate: hydrateOnVisible({ rootMargin: '200px' }),
        })
        lazyHydratedBlocks.set(componentName, lazyHydratedBlock)
    }

    return lazyHydratedBlock
}

const isComponent = (component: string | undefined): boolean => {
    return typeof resolveDynamicComponent(component) !== 'string'
}

const RoadizBlockFactory: FunctionalComponent<RoadizBlockFactoryProps> = (
    { blocks, prefix, lazyHydration = false },
    context,
): VNodeChild => {
    const lazyHydrationExclude = typeof lazyHydration === 'object' ? lazyHydration.exclude : undefined

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
            const component = resolveComponent(componentName)
            const isLazyHydrated = !!lazyHydration
                && typeof component !== 'string'
                && !isBlockExcluded(lazyHydrationExclude, { block, index, componentName })

            return h(isLazyHydrated ? getLazyHydratedBlock(componentName, component) : component, {
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

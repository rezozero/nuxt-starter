import type { RoadizWalker } from '@roadiz/types/types/roadiz'
import type { RoadizNodesSources } from '@roadiz/types'

export interface MenuItem {
    title?: string
    url?: string
    reference?: RoadizNodesSources[]
    slug?: string // keep slug for potential use in the future like creating IDs
    children?: MenuItem[]
}

function parseWalker(walker: RoadizWalker): MenuItem {
    return {
        title: walker.item?.title,
        // @ts-expect-error linkExternalUrl is not in the type definition
        url: walker.item?.linkExternalUrl as string | undefined ?? walker.item?.url,
        // @ts-expect-error linkInternalReference is not in the type definition
        reference: walker.item?.linkInternalReference as RoadizNodesSources[] | undefined,
        slug: walker.item?.slug,
        children: walker.children
            ?.filter(child => child.item?.node?.visible !== false) // prevent hidden nodes
            ?.map(parseWalker),
    }
}

export function useRoadizMenu(menu: MaybeRefOrGetter<RoadizWalker>) {
    return computed(() => {
        const menuValue = toValue(menu)

        return parseWalker(menuValue)
    })
}

import type {
    JsonLdObject,
    RoadizAlternateLink,
    RoadizNodesSources,
    RoadizNodesSourcesHead,
    RoadizWebResponse,
} from '@roadiz/types'

import type { RoadizWalkerKnown } from '~/utils/roadiz/types'
import type { NSMenu, NSMenuLink } from '~/types/roadiz'

interface HydraError {
    '@context': string
    '@type': string
    'hydra:title': string
    'hydra:description': string
    'message'?: string
    'trace': Array<HydraErrorTraceItem>
}

interface HydraErrorTraceItem {
    file: string
    line: number
    function: string
    class: string
    type: string
    args: Array<string>
}

interface PageResponse {
    webResponse: RoadizWebResponse | undefined
    alternateLinks?: RoadizAlternateLink[]
    locale?: string
}

// Set app walker slug
type CommonContentMenuKey = 'mainMenuWalker' | string

interface CommonContent {
    home?: RoadizNodesSources
    head?: RoadizNodesSourcesHead
    menus?: Record<CommonContentMenuKey, RoadizWalkerKnown<NSMenu, NSMenuLink | NSMenu>>
    errorPage?: RoadizWalkerKnown<NSPage>
}

interface CustomForm extends JsonLdObject {
    slug?: boolean
    name?: boolean
    open?: boolean
    definitionUrl?: string | null
    postUrl?: string | null
    description?: string | null
    color?: string | null
}

/*
 * This file content should be replaced entirely with new types definitions exported from Roadiz.
 * The already defined types are only placeholders. They will be replaced with the exported ones.
 *
 * RoadizNodesSources, RoadizDocument and other mentioned types are part of
 * @roadiz/types package which must be installed in your project.
 *
 * @see https://github.com/roadiz/types#readme
 *
 * Roadiz CMS node-types interfaces
 *
 * @see https://docs.roadiz.io/en/latest/developer/nodes-system/intro.html#what-is-a-node-type
 */

import type { RoadizNodesSources } from '@roadiz/types'

export type NSMenu = RoadizNodesSources

export interface NSMenuLink extends RoadizNodesSources {
    linkExternalUrl?: string
    linkInternalReference?: Array<RoadizNodesSources>
}

export type NSPage = RoadizNodesSources

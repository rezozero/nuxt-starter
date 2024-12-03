/*
 * This is an automated Roadiz interface declaration file.
 * RoadizNodesSources, RoadizDocument and other mentioned types are part of
 * @roadiz/types package which must be installed in your project.
 *
 * @see https://github.com/roadiz/types
 *
 * Roadiz CMS node-types interfaces
 *
 * @see https://docs.roadiz.io/en/latest/developer/nodes-system/intro.html#what-is-a-node-type
 */

import type { RoadizNodesSources } from '@roadiz/types'

export type NSMenu = RoadizNodesSources

export type NSMenuLink = RoadizNodesSources

export type NSPage = RoadizNodesSources

export type AllRoadizNodesSources = NSMenu | NSMenuLink | NSPage

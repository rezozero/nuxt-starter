import {RoadizNodesSources} from "@roadiz/abstract-api-client/dist/types/roadiz";

export function getNodesSourcesTitle(data: RoadizNodesSources | undefined): string | undefined {
    return data?.metaTitle || data?.title
}

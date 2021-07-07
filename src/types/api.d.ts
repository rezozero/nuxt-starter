import RoadizApi from "@roadiz/abstract-api-client";
import {RoadizNodesSources} from "@roadiz/abstract-api-client/dist/types/roadiz";
import {AlternateLink} from "@roadiz/abstract-api-client/dist/types/roadiz-api";

interface PageResponse {
    page: RoadizNodesSources
    alternateUrls?: AlternateLink[]
}

declare module '@nuxt/types' {
    interface Context {
        $api: RoadizApi
    }

    interface NuxtAppOptions {
        $api: RoadizApi
    }

    interface Configuration {
        $api?: RoadizApi
    }
}

declare module 'vue/types/vue' {
    interface Vue {
        $api: RoadizApi
    }
}

declare module '*.svg?inline' {
    import type { VueConstructor } from 'vue' // eslint-disable-line import/no-duplicates
    import Vue from 'vue' // eslint-disable-line import/no-duplicates
    const content: VueConstructor<Vue>
    export default content
}

declare module '*.svg?sprite' {
    import type { VueConstructor } from 'vue' // eslint-disable-line import/no-duplicates
    import Vue from 'vue' // eslint-disable-line import/no-duplicates
    const content: VueConstructor<Vue>
    export default content
}

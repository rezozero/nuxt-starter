declare module '*.svg?inline' {
    import Vue, { VueConstructor } from 'vue'
    const content: VueConstructor<Vue>
    export default content
}

declare module '*.svg?sprite' {
    import Vue, { VueConstructor } from 'vue'
    const content: VueConstructor<Vue>
    export default content
}

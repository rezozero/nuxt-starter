import Vue from 'vue'

declare module '*.vue' {
    export default Vue
}

declare module 'vue/types/vue' {
    interface Vue {
        // fix CSS module in component https://stackoverflow.com/a/53999913
        $style: { [key: string]: string }
        $documentURL(path: string | undefined): string
        $roadizURL(path: string): string
        $resourceUrl(path: string | undefined): string | undefined
    }
}

declare module 'vue/types/options' {
    // fix CSS module in render method https://stackoverflow.com/a/53999913
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface RenderContext<Props = DefaultProps> {
        $style: { [key: string]: string }
    }
}

import Vue from 'vue'

declare module '*.vue' {
    export default Vue
}

/**
 * fix CSS module
 * @see https://stackoverflow.com/a/53999913
 */
declare module 'vue/types/vue' {
    interface Vue {
        $style: { [key: string]: string }
        $resourceUrl(path: string | undefined): string | undefined
    }
}

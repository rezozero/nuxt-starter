import { MetaPropertyName } from 'vue-meta/types/vue-meta'

interface TwitterMetaOptions {
    title?: string
    description?: string
    url?: string
    image?: string
}

interface FacebookMetaOptions {
    title?: string
    description?: string
    url?: string
    image?: string
    siteName?: string
}

interface PageMetaPropertyName extends MetaPropertyName {
    hid: string
}

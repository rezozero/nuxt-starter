// from https://github.com/nuxt/image/blob/main/src/runtime/components/image.mixin.ts
// TODO: use directly the mixin? But it seems that's not working
export default {
    src: { type: String, required: true },

    // modifiers
    format: { type: String, default: undefined },
    quality: { type: [Number, String], default: undefined },
    background: { type: String, default: undefined },
    fit: { type: String, default: undefined },
    modifiers: { type: Object as () => Record<string, any>, default: undefined },

    // options
    preset: { type: String, default: undefined },
    provider: { type: String, default: undefined },

    sizes: { type: [Object, String] as unknown as () => string | Record<string, any>, default: undefined },
    preload: { type: Boolean, default: undefined },

    // <img> attributes
    width: { type: [String, Number], default: undefined },
    height: { type: [String, Number], default: undefined },
    alt: { type: String, default: undefined },
    referrerpolicy: { type: String, default: undefined },
    usemap: { type: String, default: undefined },
    longdesc: { type: String, default: undefined },
    ismap: { type: Boolean, default: undefined },
    crossorigin: {
        type: [Boolean, String] as unknown as () => boolean | '' | 'anonymous' | 'use-credentials',
        default: undefined,
        validator: (val: string | boolean) => ['anonymous', 'use-credentials', '', true, false].includes(val),
    },
    loading: { type: String, default: undefined },
    decoding: {
        type: String as () => 'async' | 'auto' | 'sync',
        default: undefined,
        validator: (val: string) => ['async', 'auto', 'sync'].includes(val),
    },
}

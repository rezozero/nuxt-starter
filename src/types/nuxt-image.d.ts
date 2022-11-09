// TODO: generate the type declaration automatically from the component props
// @see https://github.com/vuejs/core/issues/4294#issuecomment-1030594118
export interface NuxtImageProps {
    src: string

    // modifiers
    format?: string
    quality?: number | string
    background?: string
    fit?: string
    modifiers?: Record<string, any>

    // options
    preset?: string
    provider?: string

    sizes?: string | Record<string, any>
    preload?: boolean

    // <img> attributes
    width?: string | number
    height?: string | number
    alt?: string
    referrerpolicy?: string
    usemap?: string
    longdesc?: string
    ismap?: boolean
    crossorigin?: boolean | string
    loading?: string
    decoding?: string
}

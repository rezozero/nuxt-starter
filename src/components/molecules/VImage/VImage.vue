<script lang="ts">
import Vue from 'vue'
import type { PropType, VNode } from 'vue'
import { RoadizDocument } from '@roadiz/abstract-api-client/dist/types/roadiz'
import nuxtImageProps from '~/utils/image/nuxt-image-props'
import interventionRequestProps from '~/utils/image/intervention-request-props'
import { InterventionRequestProps } from '~/types/intervention-request'
import { NuxtImageProps } from '~/types/nuxt-image'

interface Props {
    src?: string
    document?: RoadizDocument
    copyright?: string | boolean
    // only placement top can be used for the moment.
    copyrightPlacement?: string | boolean
    tag?: string
    ratio?: number | boolean
    placeholder?: string | boolean
    loading?: 'lazy' | 'eager'
}

export type VImageProps = Props & InterventionRequestProps & Omit<NuxtImageProps, 'src'>

export default Vue.extend<any, any, any, VImageProps>({
    name: 'VImage',
    props: {
        ...nuxtImageProps,
        ...interventionRequestProps,
        src: String,
        document: Object as PropType<RoadizDocument>,
        copyright: [String, Boolean],
        copyrightPlacement: [String, Boolean],
        tag: { type: String, default: 'picture' },
        ratio: { type: [Boolean, Number], default: true },
        placeholder: { type: [String, Boolean], default: true },
        loading: { type: String as PropType<Props['loading']>, default: 'lazy' },
    },
    data() {
        return {
            loaded: false,
        }
    },
    mounted() {
        const img = this.$el?.querySelector?.('img')

        if (img?.complete) this.loaded = true
    },
    render(createElement): VNode {
        const src = this.src || this.document?.thumbnail?.relativePath || this.document?.relativePath

        if (!src) return createElement('')

        const extension = src.split('.').pop()
        const isSvg = extension.slice(0, 3) === 'svg'
        const processable = this.document?.processable || !isSvg
        const alt = this.alt || this.document?.alt
        const copyright =
            this.copyright === 'string' || this.copyright === false ? this.copyright : this.document?.copyright

        let width = 0
        if (typeof this.width !== 'undefined')
            width = this.width === 'string' ? parseFloat(this.width) : (this.width as number)
        else if (this.crop) width = parseFloat(this.crop.split('x')[0])
        else if (this.document?.imageWidth) width = parseFloat(this.document.imageWidth)

        let height = 0
        if (this.height) height = typeof this.height === 'string' ? parseFloat(this.height) : this.height
        else if (this.crop) height = parseFloat(this.crop.split('x')[1])
        else if (this.document?.imageHeight) height = parseFloat(this.document.imageHeight)

        // image
        const modifiersKeys = Object.keys(interventionRequestProps).filter((key) => !['width', 'height'].includes(key))
        const imgModifiers = { ...(this.modifiers || {}) }
        modifiersKeys.forEach((key) => {
            if (typeof this.$props[key] !== 'undefined') imgModifiers[key] = this.$props[key]
        })
        const imgProps: Record<string, any> = {
            ...this.$props,
            src: src || this.src,
            alt: alt || this.alt,
            width: (!this.ratio && width) || '',
            height: (!this.ratio && height) || '',
            modifiers: imgModifiers,
        }
        const img = createElement(this.tag === 'img' || !processable ? 'nuxt-img' : 'nuxt-picture', {
            props: imgProps,
            on: {
                load: () => {
                    this.loaded = true
                },
            },
        })

        if (this.ratio || copyright || this.placeholder || this.rounded) {
            const figureStyle: Record<string, string> = {}
            const children: VNode[] = [img]

            if (this.ratio) {
                if (typeof this.ratio === 'number') {
                    figureStyle.paddingBottom = this.ratio * 100 + '%'
                } else if (width && height) {
                    figureStyle.paddingBottom = (height / width) * 100 + '%'
                }
            }

            if (this.placeholder) {
                let background

                if (typeof this.placeholder === 'string') {
                    background = this.placeholder
                } else if (this.document?.imageAverageColor) {
                    background = this.document?.imageAverageColor
                    // background = context.parent.$img(this.document.relativePath, {
                    //     ...imgModifiers,
                    //     width: 50,
                    //     blur: 10,
                    // })
                }

                if (background) figureStyle.background = background
            }

            if (copyright) {
                children.push(
                    createElement(
                        'VInformation',
                        {
                            class: [
                                this.$style.copyright,
                                this.copyrightPlacement && this.$style['copyright--' + this.copyrightPlacement],
                            ],
                            props: {
                                placement: this.copyrightPlacement === 'top' ? 'bottom-end' : 'top-end',
                                outlined: true,
                            },
                        },
                        copyright
                    )
                )
            }

            return createElement(
                'figure',
                {
                    style: figureStyle,
                    class: [
                        this.$style.root,
                        this.ratio && this.$style['root--ratio'],
                        // this.placeholder && this.$style['root--placeholder'],
                        this.loading === 'lazy' && this.$style['root--lazy'],
                        this.loaded && this.$style['root--loaded'],
                        this.rounded && this.$style['root--rounded'],
                        this.roundedReady && this.$style['root--rounded-ready'],
                        this.rounded === 'reverse' && this.$style['root--rounded-reverse'],
                    ],
                },
                children
            )
        }

        return img
    },
})
</script>

<style lang="scss" module>
.root {
    display: inline-block;
    background-color: var(--image-background-color);
    border-radius: var(--image-border-radius, 0);
    transform: translate(0); // update context to prevent crop glitch on safari

    &--ratio {
        position: relative;
        display: block;
    }

    //&--placeholder {
    //    background-repeat: no-repeat;
    //    background-size: cover;
    //}
}

// targets direct <img /> child or <picture /> nested <img />
.root img {
    display: block;
    width: var(--image-width, auto);
    max-width: var(--image-max-width, 100%);
    height: var(--image-height, auto);
    object-fit: var(--image-object-fit, initial);
    object-position: var(--image-object-position, initial);
}

.root--ratio img {
    position: absolute;
    top: 0;
    left: 0;
    width: var(--image-width, 100%);
    height: var(--image-height, 100%);
    object-fit: var(--image-object-fit, cover);
}

.root--lazy img {
    opacity: 0;
    transition: var(--image-img-transition, all 0s), opacity 0.3s;
}

.root--loaded img {
    opacity: 1;
}

.copyright {
    position: absolute !important;
    z-index: 2;
    right: var(--gutter);
    bottom: var(--gutter);
}
.copyright--top {
    top: var(--gutter);
    right: var(--gutter);
}
.copyright--bottom-start {
    right: inherit;
    bottom: var(--gutter);
    left: var(--gutter);
}
</style>

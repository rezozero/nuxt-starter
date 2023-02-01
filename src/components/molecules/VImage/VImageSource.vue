<script lang="ts">
import Vue from 'vue'
import type { VNode } from 'vue'
import { ImageOptions } from '@nuxt/image'
import nuxtImageProps from '~/utils/image/nuxt-image-props'
import interventionRequestProps from '~/utils/image/intervention-request-props'
// import { getBreakpointValue } from '~/utils/media'
//
// const BREAKPOINT_OPERATORS = ['>=', '>', '<=', '<']
//
// function getMedia(value?: string): string | undefined {
//     if (!value) return
//
//     const formattedValue = value.trim()
//
//     if (formattedValue.startsWith('(') && formattedValue.endsWith(')')) return formattedValue
//
//     let computedMedia: string | undefined
//
//     for (let i = 0; i < BREAKPOINT_OPERATORS.length; i++) {
//         const operator = BREAKPOINT_OPERATORS[i]
//
//         if (formattedValue.startsWith(operator)) {
//             const breakpoint = formattedValue.replace(BREAKPOINT_OPERATORS[i], '')
//             const breakpointValue = getBreakpointValue(breakpoint)
//
//             if (breakpointValue) {
//                 let query: string | undefined
//                 let query
//
//                 switch (operator) {
//                     case '>=':
//                         query = `min-width:${breakpointValue}px`
//                 }
//                 break
//             }
//         }
//     }
//
//     return computedMedia || formattedValue
// }

export default Vue.extend({
    name: 'VImageSource',
    functional: true,
    props: {
        ...nuxtImageProps,
        ...interventionRequestProps,
        media: String,
    },
    render(createElement, context): VNode | VNode[] {
        const media = context.props.media
        const interventionRequestKeys = Object.keys(interventionRequestProps)
        const modifiersKeys = [
            ...interventionRequestKeys,
            'format',
            'quality',
            'background',
            'fit',
            'modifiers',
        ].filter((key) => !['width', 'height'].includes(key))
        const modifiers = {}
        modifiersKeys.forEach((key) => {
            // @ts-ignore
            if (typeof context.props[key] !== 'undefined') modifiers[key] = context.props[key]
        })
        const options: ImageOptions = {
            provider: context.props.provider,
            preset: context.props.preset,
            modifiers,
            sizes: context.props.sizes || context.parent.$img.options.screens,
        }
        const formattedSizes =
            typeof context.props.sizes === 'string'
                ? context.props.sizes.split(' ')
                : context.props.sizes && Object.values(context.props.sizes)
        const sizes = context.parent.$img.getSizes(context.props.src, options, formattedSizes)
        const children = [
            createElement('source', {
                attrs: {
                    srcset: sizes.srcset,
                    media,
                },
            }),
        ]

        if (context.props.format !== 'webp' && !context.props.src.endsWith('.webp')) {
            const webpSizes = context.parent.$img.getSizes(
                context.props.src,
                { ...options, modifiers: { ...options.modifiers, format: 'webp' } },
                formattedSizes
            )

            children.unshift(
                createElement('source', {
                    attrs: {
                        srcset: webpSizes.srcset,
                        media,
                        type: 'image/webp',
                    },
                })
            )
        }

        return children
    },
})
</script>

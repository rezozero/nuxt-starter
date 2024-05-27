<script lang="ts">
import { pictureProps } from '#image/components/nuxt-picture'
import type { ExtractPropTypes } from 'vue'
import VImg from '~/components/molecules/VImg/VImg.vue'
import { imgProps } from '#image/components/nuxt-img'
import VPictureSource from '~/components/molecules/VPicture/VPictureSource.vue'

export const vPictureProps = {
    ...pictureProps,
    placeholder: imgProps.placeholder,
}

export type VPictureProps = ExtractPropTypes<typeof vPictureProps>

export default defineComponent({
    props: {
        ...vPictureProps,
    },
    setup(props, context) {
        // Provide props to children (<sources>)
        provide('pictureProps', props)

        const imgFilteredProps = computed(() =>
            Object.keys(props).reduce((acc, key) => {
                if (key in imgProps) {
                    acc[key] = props[key]
                }
                return acc
            }, {}),
        )

        const img = h(VImg, {
            ...imgFilteredProps.value,
            format: undefined, // let the VImg choose the format itself
            ...props.imgAttrs,
        })
        const $img = useImage()
        const sources = computed(() => {
            return (
                context.slots.default?.() ||
                h(VPictureSource, {
                    sizes: props.sizes || $img.options.screens,
                })
            )
        })

        return () => h('picture', null, [sources.value, img])
    },
})
</script>

<style lang="scss" module>
.root img {
    // for switching easily between VImg and VPicture, we use the same css var name
    max-width: var(--v-img-max-width, 100%); // responsive image
    height: var(--v-img-height, auto); // responsive image
    background: var(--v-img-background, var(--v-img-placeholder));
}

.root--loaded img {
    // Remove background when image is loaded. This is useful for hiding antialiasing artifacts.
    --v-img-background: none;
}
</style>

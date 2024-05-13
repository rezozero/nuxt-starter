<script lang="ts">
import { pictureProps } from '#image/components/nuxt-picture'
import type { ExtractPropTypes } from 'vue'
import { NuxtImg, NuxtPicture } from '#components'

export const vPictureProps = {
    ...pictureProps,
    placeholder: {
        type: String,
    },
}

export type VPictureProps = ExtractPropTypes<typeof vPictureProps>

export default defineComponent({
    props: {
        ...vPictureProps,
    },
    setup(props) {
        const $style = useCssModule()
        const { vNodeProps, root, rootStyle, loaded, onLoad } = useBaseImage({ props })

        if (!vNodeProps.value.src) return () => null

        const rootVNodeProps = computed(() => ({
            ref: root,
            // `style` and `class` cannot be used on <img> because NuxtPicture `imgAttrs` prop is not reactive
            style: rootStyle,
            class: [$style.root, loaded.value && $style['root--loaded']],
        }))

        const imgAttrs = computed(() => {
            return {
                ...vNodeProps.value.imgAttrs,
                placeholder: vNodeProps.value.placeholder,
                onLoad,
            }
        })

        // Custom render for <source> tags
        const slots = useSlots()

        if (slots.default) {
            provide('pictureVNodeProps', vNodeProps)

            const img = h(NuxtImg, {
                ...vNodeProps.value,
                ...imgAttrs.value,
            })

            return () =>
                h(
                    'picture',
                    {
                        ...rootVNodeProps.value,
                    },
                    [slots.default!(), img],
                )
        }

        // regular render
        return () =>
            h(NuxtPicture, {
                ...rootVNodeProps.value,
                ...vNodeProps.value,
                imgAttrs: {
                    ...imgAttrs.value,
                },
            })
    },
})
</script>

<style lang="scss" module>
.root img {
    // for switching easily between VImg and VPicture, we use the same css var name
    max-width: var(--v-img-max-width, 100%); // responsive image
    height: var(--v-img-max-width, auto); // responsive image
    background: var(--v-img-background, var(--v-img-placeholder));
}

.root--loaded img {
    // Remove background when image is loaded. This is useful for hiding antialiasing artifacts.
    --v-img-background: none;
}
</style>

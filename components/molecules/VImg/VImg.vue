<script lang="ts">
import type { ExtractPropTypes } from 'vue'
import { imgProps } from '#image/components/nuxt-img'
import { NuxtImg } from '#components'

export const vImgProps = {
    ...imgProps,
    loading: {
        type: imgProps.loading.type,
        // overrides NuxtImg default value
        default: 'lazy',
    },
}

export type VImgProps = ExtractPropTypes<typeof vImgProps>

export default defineComponent({
    props: {
        ...vImgProps,
    },
    setup(props) {
        const $style = useCssModule()
        const { vNodeProps, root, rootStyle, loaded, onLoad } = useBaseImage({ props })

        if (!vNodeProps.value.src) return () => null

        return () =>
            h(NuxtImg, {
                ...vNodeProps.value,
                ref: root,
                style: rootStyle,
                class: [$style.root, loaded.value && $style['root--loaded']],
                onLoad,
            })
    },
})
</script>

<style lang="scss" module>
.root {
    max-width: var(--v-img-max-width, 100%); // responsive image
    height: var(--v-img-height, auto); // responsive image
    background: var(--v-img-background, var(--v-img-placeholder));

    &--loaded {
        // Remove background when image is loaded. This is useful for hiding antialiasing artifacts.
        --v-img-background: none;
    }
}
</style>

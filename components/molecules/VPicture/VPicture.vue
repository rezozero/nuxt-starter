<script lang="ts">
import type { ExtractPropTypes } from 'vue'
import pick from 'lodash/pick'
import { pictureProps } from '#image/components/nuxt-picture'
import { imgProps } from '#image/components/nuxt-img'
import VImg from '~/components/molecules/VImg/VImg.vue'
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

        const $style = useCssModule()
        const imgFilteredProps = computed(() => pick(props, Object.keys(imgProps)))

        return () =>
            h('picture', { class: $style.root }, [
                context.slots.default?.() || h(VPictureSource),
                h(VImg, {
                    ...imgFilteredProps.value,
                    ...props.imgAttrs,
                }),
            ])
    },
})
</script>

<style lang="scss" module>
.root {
    display: var(--v-picture-display, fit-content);
}
</style>

<script lang="ts">
import type { ExtractPropTypes, ImgHTMLAttributes, PropType } from 'vue'
import type { VImgProps } from '~/components/VImg.vue'
import pick from 'lodash/pick'
import VImg, { vImgProps } from '~/components/VImg.vue'
import VPictureSource from '~/components/VPictureSource.vue'

export const vPictureProps = {
    ...vImgProps,
    // NuxtPicture v2 extra props
    legacyFormat: { type: String },
    imgAttrs: { type: Object as PropType<ImgHTMLAttributes> },
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
        const imgFilteredProps = computed(() => pick(props, Object.keys(vImgProps)) as VImgProps)

        return () =>
            h('picture', { class: $style.root }, [
                context.slots.default?.() || h(VPictureSource),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                h(VImg, { ...imgFilteredProps.value, ...props.imgAttrs } as any),
            ])
    },
})
</script>

<style lang="scss" module>
.root {
    display: var(--v-picture-display, fit-content);
}
</style>

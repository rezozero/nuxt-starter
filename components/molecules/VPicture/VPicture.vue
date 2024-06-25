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
    inheritAttrs: false,
    props: {
        ...vPictureProps,
    },
    setup(props, context) {
        // Provide props to children (<sources>)
        provide('pictureProps', props)

        const $style = useCssModule()
        const imgFilteredProps = computed(() => pick(props, Object.keys(imgProps)))
        const img = h(VImg, {
            ...imgFilteredProps.value,
            ...props.imgAttrs,
            ...context.attrs,
        })
        const sources = computed(() => {
            return context.slots.default?.() || h(VPictureSource)
        })

        return () => h('picture', { class: $style.root }, [sources.value, img])
    },
})
</script>

<style lang="scss" module>
.root {
    display: contents;
}
</style>

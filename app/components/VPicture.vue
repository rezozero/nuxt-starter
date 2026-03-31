<script lang="ts">
import type { ExtractPropTypes } from 'vue'
import pick from 'lodash/pick'
// TODO resolve : Cannot find module '#image/components/NuxtPicture.vue' or its corresponding type declarations.
import { pictureProps } from '#image/components/NuxtPicture.vue'
// TODO resolve : Cannot find module '#image/components/NuxtImg.vue' or its corresponding type declarations.
import { imgProps } from '#image/components/NuxtImg.vue'
import VImg from '~/components/VImg.vue'
import VPictureSource from '~/components/VPictureSource.vue'

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

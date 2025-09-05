<script lang="ts">
import { VRoadizLink } from '#components'
import type { RoadizDocument } from '@roadiz/types'

type PossibleClass = string | undefined | false
export type SlotClass = PossibleClass | PossibleClass[]
export type SlotName = 'overtitle' | 'title' | 'content' | 'image' | 'cta'

export interface Props {
    title?: string | undefined
    overtitle?: string | null
    content?: string | null
    image?: RoadizDocument | null
    url?: string | undefined
    linkLabel?: string
    linkExtended?: boolean
    ui?: Partial<Record<SlotName, SlotClass>>
}
</script>

<script lang="ts" setup>
const props = defineProps<Props>()

const { t } = useI18n()

const ctaProps = computed(() => {
    if (!props.url) return

    return {
        tag: props.linkExtended ? 'div' : undefined,
        to: props.linkExtended ? undefined : props.url,
        iconName: 'arrow-right',
        label: props.linkLabel || t('card.link_label'),
    }
})

const $style = useCssModule()
function getClasses(key: SlotName) {
    return [$style[key], props.ui?.[key]]
}
</script>

<template>
    <div
        :class="[$style.root, linkExtended && $style['root--link-extended']]"
    >
        <slot
            name="title"
            :item-class="getClasses('title')"
        >
            <component
                :is="linkExtended ? VRoadizLink : 'div'"
                v-if="title"
                :url="linkExtended ? url : undefined"
                :class="getClasses('title')"
            >
                {{ title }}
            </component>
        </slot>
        <slot
            name="overtitle"
            :item-class="getClasses('overtitle')"
        >
            <div
                v-if="overtitle"
                :class="getClasses('overtitle')"
            >
                {{ overtitle }}
            </div>
        </slot>
        <slot
            name="content"
            :item-class="getClasses('content')"
        >
            <VMarkdown
                v-if="content"
                :class="getClasses('content')"
                :content="content"
                inline
                tag="p"
            />
        </slot>
        <slot
            name="image"
            :item-class="getClasses('image')"
        >
            <VRoadizImage
                v-if="image"
                :document="image"
                :class="getClasses('image')"
            />
        </slot>
        <slot
            name="cta"
            v-bind="{ ctaProps, itemClass: getClasses('cta') }"
        >
            <VButton
                v-if="ctaProps"
                :class="getClasses('cta')"
                v-bind="ctaProps"
                :aria-label="title"
            />
        </slot>
    </div>
</template>

<style lang="scss" module>
.root {
    position: relative;
    display: grid;
    grid-template-areas: var(--v-card-grid-template-area,
        "image"
        "overtitle"
        "title"
        "content"
        "cta"
    );
}

.overtitle {
    grid-area: overtitle;
    margin-top: 10px;
}

.title {
    grid-area: title;
    margin-top: 10px;

    .root--link-extended &::before {
        position: absolute;
        z-index: 4;
        content: '';
        inset: 0;
    }
}

.content {
    grid-area: content;
    margin-block: 10px 0;
}

.image {
    grid-area: image;
    width: 100%;
}

.cta {
    grid-area: cta;
    margin-top: 10px;
}
</style>

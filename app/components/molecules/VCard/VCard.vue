<script lang="ts">
import { VRoadizLink } from '#components'
import type { RoadizDocument } from '@roadiz/types'

type PossibleClass = string | undefined | false
export type SlotClass = PossibleClass | PossibleClass[]
export type SlotName = 'overtitle' | 'title' | 'content' | 'image' | 'cta'

export interface Props {
    title?: string | undefined
    titleHeading?: string
    overtitle?: string | null
    content?: string | null
    image?: RoadizDocument | null
    url?: string | undefined
    linkLabel?: string
    linkExtended?: boolean
    ui?: Partial<Record<SlotName | 'link', SlotClass>>
}
</script>

<script lang="ts" setup>
// Based on DSFR Card component
// https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/carte
const props = defineProps<Props>()

const { t } = useI18n()

const linkExtendedEnabled = computed(() => !!props.url && !!props.linkExtended)
const ctaProps = computed(() => {
    if (!props.url) return

    return {
        tag: linkExtendedEnabled.value ? 'div' : undefined,
        to: linkExtendedEnabled.value ? undefined : props.url,
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
        :class="[$style.root, linkExtendedEnabled && $style['root--link-extended']]"
    >
        <slot
            name="title"
            :item-class="getClasses('title')"
        >
            <component
                :is="titleHeading || 'h3'"
                :class="getClasses('title')"
            >
                <VWrapper
                    v-if="title"
                    :wrapper="linkExtendedEnabled ? VRoadizLink : undefined"
                    :url="linkExtendedEnabled ? url : undefined"
                    :class="[$style.link, props.ui?.link]"
                >
                    {{ title }}
                </VWrapper>
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
                :aria-label="linkExtendedEnabled ? undefined : title"
            />
        </slot>
    </div>
</template>

<style lang="scss" module>
.root {
    position: relative;
    display: grid;
    grid-template-areas: var(--v-card-grid-template-areas,
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
}

.link {
    .root--link-extended &::before {
        position: absolute;
        z-index: 1;
        content: '';
        inset: 0;
    }

    &:focus-visible {
        outline: none;

        &::before {
            outline: 2px solid currentColor;
            outline-offset: 6px;
        }
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

<script lang="ts">
import { VRoadizLink } from '#components'
import type { RoadizDocument } from '@roadiz/types'

type PossibleClass = string | undefined | false
export type SlotClass = PossibleClass | PossibleClass[]
export type SlotName = 'overtitle' | 'title' | 'content' | 'image' | 'cta'
export type ElementClass = Partial<Record<SlotName | 'link', SlotClass>>

export interface Props {
    title?: string
    titleTagName?: string
    overtitle?: string | null
    content?: string | null
    image?: RoadizDocument | null
    url?: string
    linkLabel?: string
    extendLink?: boolean
    elementClass?: ElementClass
}
</script>

<script lang="ts" setup>
// Based on DSFR Card component
// https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/carte
const props = defineProps<Props>()

const { t } = useI18n()

const extendLinkEnabled = computed(() => !!props.url && !!props.extendLink)
const ctaProps = computed(() => {
    if (!props.url) return

    return {
        tag: extendLinkEnabled.value ? 'div' : undefined,
        to: extendLinkEnabled.value ? undefined : props.url,
        iconName: 'arrow-right',
        label: props.linkLabel || t('card.link_label'),
    }
})

const $style = useCssModule()
function getElementClasses(key: keyof ElementClass) {
    return [$style[key], props.elementClass?.[key]]
}
</script>

<template>
    <div
        :class="[$style.root, extendLinkEnabled && $style['root--link-extended']]"
    >
        <slot
            name="title"
            :item-class="getElementClasses('title')"
        >
            <component
                :is="titleTagName || 'h3'"
                :class="getElementClasses('title')"
            >
                <VWrapper
                    v-if="title"
                    :wrapper="extendLinkEnabled ? VRoadizLink : undefined"
                    :url="extendLinkEnabled ? url : undefined"
                    :class="getElementClasses('link')"
                >
                    {{ title }}
                </VWrapper>
            </component>
        </slot>
        <slot
            name="overtitle"
            :item-class="getElementClasses('overtitle')"
        >
            <div
                v-if="overtitle"
                :class="getElementClasses('overtitle')"
            >
                {{ overtitle }}
            </div>
        </slot>
        <slot
            name="content"
            :item-class="getElementClasses('content')"
        >
            <VMarkdown
                v-if="content"
                :class="getElementClasses('content')"
                :content="content"
                inline
                tag="p"
            />
        </slot>
        <slot
            name="image"
            :item-class="getElementClasses('image')"
        >
            <VRoadizImage
                v-if="image"
                :document="image"
                :class="getElementClasses('image')"
            />
        </slot>
        <slot
            name="cta"
            v-bind="{ ctaProps, itemClass: getElementClasses('cta') }"
        >
            <VButton
                v-if="ctaProps"
                :class="getElementClasses('cta')"
                v-bind="ctaProps"
                :aria-label="extendLinkEnabled ? undefined : title"
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
    margin-top: 10px;
    grid-area: overtitle;
}

.title {
    margin-top: 10px;
    grid-area: title;
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
            outline: 2px solid currentcolor;
            outline-offset: 6px;
        }
    }
}

.content {
    grid-area: content;
    margin-block: 10px 0;
}

.image {
    width: 100%;
    grid-area: image;
}

.cta {
    margin-top: 10px;
    grid-area: cta;
}
</style>

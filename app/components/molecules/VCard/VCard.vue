<script lang="ts">
import { VRoadizLink } from '#components'
import type { RoadizDocument } from '@roadiz/types'

export interface Props {
    title?: string
    titleTagName?: string
    overtitle?: string | null
    content?: string | null
    image?: RoadizDocument | null
    url?: string
    linkLabel?: string
    extendLink?: boolean
}
</script>

<script lang="ts" setup>
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
</script>

<template>
    <div
        :class="[$style.root, extendLinkEnabled && $style['root--link-extended']]"
    >
        <slot
            name="title"
        >
            <component
                :is="titleTagName || 'h3'"
                :class="$style.title"
            >
                <VWrapper
                    v-if="title"
                    :wrapper="extendLinkEnabled ? VRoadizLink : undefined"
                    :url="extendLinkEnabled ? url : undefined"
                    :class="$style.link"
                >
                    {{ title }}
                </VWrapper>
            </component>
        </slot>
        <slot
            name="overtitle"
        >
            <div
                v-if="overtitle"
                :class="$style.overtitle"
            >
                {{ overtitle }}
            </div>
        </slot>
        <slot
            name="content"
        >
            <VMarkdown
                v-if="content"
                :class="$style.content"
                :content="content"
                inline
                tag="p"
            />
        </slot>
        <slot
            name="image"
        >
            <VRoadizImage
                v-if="image"
                :document="image"
                :class="$style.image"
            />
        </slot>
        <slot
            name="cta"
            v-bind="ctaProps"
        >
            <VButton
                v-if="ctaProps"
                :class="$style.cta"
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
    text-decoration: none;
    color: inherit;

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
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--v-card-content-line-clamp, 3);
}

.image {
    width: 100%;
    grid-area: image;
}

.cta {
    margin-top: 10px;
    grid-area: cta;
    width: fit-content;
}
</style>

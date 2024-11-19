<script setup lang="ts">
import type { PropType } from 'vue'
import type { RoadizNodesSources } from '@roadiz/types'
import { useThemeProvider } from '#imports'

export interface RoadizAlert extends RoadizNodesSources {
    content?: string
    linkLabel?: string
    linkExternalUrl?: string
    linkInternalReference?: RoadizNodesSources | RoadizNodesSources[]
    linkEventReference?: RoadizNodesSources | RoadizNodesSources[]
}

const props = defineProps({
    alert: {
        type: Object as PropType<RoadizAlert>,
        required: true,
    },
})

const emit = defineEmits(['close'])

const linkReference = computed(
    () => props.alert?.linkEventReference || props.alert?.linkInternalReference,
)

function close() {
    emit('close', props.alert)
}

const { themeClass } = useThemeProvider({ preferredTheme: 'dark' })
</script>

<template>
    <div :class="[themeClass, $style.root]">
        <div
            v-if="alert.title"
            :class="$style.title"
        >
            {{ alert.title }}
        </div>
        <div :class="$style.body">
            <VMarkdown
                :content="alert.content"
            />
            <VLinkButton
                :label="alert.linkLabel"
                :reference="linkReference"
                :url="alert.linkExternalUrl"
                :class="$style.link"
                outlined
            />
        </div>
        <VButton
            :class="$style.close"
            :aria-label="$t('close')"
            outlined
            @click="close"
        >
            <VIcon name="cross-small" />
        </VButton>
    </div>
</template>

<style lang="scss" module>
@use 'sass:math';
@use "assets/scss/functions/rem" as *;
@use "assets/scss/mixins/theme" as *;
@use "assets/scss/mixins/include-media" as *;

.root {
    @include theme-variants;

    & {
        display: flex;
        flex-wrap: wrap;
        padding: rem(32);
        background-color: #000;
        color: #fff;
        gap: 0 rem(24);
    }
}

.title {
    @include media('>=md') {
        width: math.div(450, 1440) * 100%;
        padding-left: rem(24);
    }
}

.body {
    & {
        width: 100%;
        order: 2;
        padding-right: rem(48);
        margin-top: rem(12);
    }

    @include media('>=md') {
        width: math.div(560, 1440) * 100%;
        max-width: 650px;
        order: 1;
        padding-right: 0;
        margin-top: 0;
    }
}

.link {
    & {
        margin-top: rem(16);
    }

    @include media('>=md') {
        margin-top: rem(4);
    }
}

.close {
    order: 1;
    margin-left: auto;
}
</style>

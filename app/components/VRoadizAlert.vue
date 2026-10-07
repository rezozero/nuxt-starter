<script setup lang="ts">
import type { NSAlert } from '~~/types/roadiz'

const props = defineProps<{
    alert: NSAlert
}>()

const emit = defineEmits(['close'])

const linkReference = computed(() => {
    return props.alert?.linkEventReference || props.alert?.linkInternalReference?.[0]
})

function close() {
    emit('close', props.alert)
}

const { themeClass } = useThemeProvider({ preferredTheme: 'light' })
</script>

<template>
    <section
        :class="[$style.root, themeClass]"
        class="grid"
    >
        <VButton
            :class="$style.close"
            :aria-label="$t('close')"
            icon-name="cross-small"
            @click="close"
        />
        <h2 :class="$style.title">
            {{ alert.title }}
        </h2>
        <VMarkdown
            v-if="alert.content"
            :content="alert.content"
            :class="$style.content"
            inline
            tag="p"
        />
        <VRoadizLinkButton
            v-if="linkReference || alert.linkExternalUrl"
            :label="alert.linkLabel"
            :reference="linkReference"
            :url="alert.linkExternalUrl"
            :class="$style.link"
        />
    </section>
</template>

<style lang="scss" module>
@use "assets/scss/mixins/theme" as *;

.root {
    @include theme-variants('alert' 'surfaces-primary' 'content-primary');

    position: relative;
    z-index: 101;
    background-color: var(--v-roadiz-alert-background, var(--surfaces-primary));
    color: var(--content-primary, currentColor);
    grid-auto-flow: dense;
    padding-block: 28px;
}

.close {
    width: fit-content;
    grid-column-end: -1;
}

.title {
    grid-column: 1 / -3;
    margin-block: 0;
}

.content {
    grid-column: 1 / -1;
    margin-block: 14px 0;
}

.link {
    width: fit-content;
    margin-top: 24px;
    grid-column: 1 / -1;
}
</style>

<script lang="ts" setup>
// Stands in for a third-party embed until the visitor grants its service
const props = defineProps<{
    // Service name shown to the visitor
    name: string
}>()

const emit = defineEmits<{ request: [] }>()

// Without the CMP, there is nothing to request consent from: the visitor has to let it load first
const { unavailable } = useConsent()
</script>

<template>
    <div :class="$style.root">
        <p
            :class="$style.message"
            class="text-body-s"
        >
            {{ $t(unavailable ? 'embed_consent.unavailable_message' : 'embed_consent.message', { service: props.name }) }}
        </p>
        <VButton
            v-if="!unavailable"
            :label="$t('embed_consent.button_label', { service: props.name })"
            theme="light"
            size="sm"
            @click="emit('request')"
        />
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/mixins/theme' as *;

.root {
    @include theme('dark');

    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: px-to-rem(24);

    // Without a height from its container, it holds the embed's usual ratio
    aspect-ratio: var(--v-embed-consent-aspect-ratio, 16 / 9);
    background-color: var(--color-surfaces-primary);
    color: var(--color-content-primary);
    gap: px-to-rem(16);
    text-align: center;
}

.message {
    max-width: 40ch;
    margin: 0;
}
</style>

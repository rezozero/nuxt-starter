<script lang="ts" setup>
// Opened by `useConsent().open()` in place of the consent settings, when the CMP never loaded
// (blocked by an ad blocker, for instance): a link to the consent settings would otherwise do nothing.
const emit = defineEmits<{ 'after-leave': [] }>()

const { isUnavailableDialogOpen } = useConsent()

const titleId = useId()
const messageId = useId()
</script>

<template>
    <VModal
        v-model="isUnavailableDialogOpen"
        :aria-labelledby="titleId"
        :aria-describedby="messageId"
        :class="$style.root"
        @after-leave="emit('after-leave')"
    >
        <h2
            :id="titleId"
            :class="$style.title"
            class="text-h4"
        >
            {{ $t('consent.unavailable_title') }}
        </h2>
        <p
            :id="messageId"
            :class="$style.message"
            class="text-body-s"
        >
            {{ $t('consent.unavailable_message') }}
        </p>
    </VModal>
</template>

<style lang="scss" module>
.root {
    --v-modal-max-width: #{px-to-rem(480)};

    padding: px-to-rem(32);
    padding-right: px-to-rem(32 + 48); // room for the close button
    border: none;
}

.title {
    margin-block: 0 px-to-rem(12);
}

.message {
    margin: 0;
}
</style>

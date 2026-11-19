<script lang="ts" setup>
// The consent status is shared app state (fed by the `consent` plugin): toggled here to show both messages
const { status } = useConsent()
const initialStatus = status.value
const unavailable = computed({
    get: () => status.value === 'unavailable',
    set: value => (status.value = value ? 'unavailable' : 'loaded'),
})

onBeforeUnmount(() => {
    status.value = initialStatus
})

const requestCount = ref(0)
</script>

<template>
    <NuxtStory>
        <template #aside>
            <label>
                <input
                    v-model="unavailable"
                    type="checkbox"
                >
                CMP unavailable (blocked by an ad blocker)
            </label>
            <p>Consent requests: {{ requestCount }}</p>
        </template>
        <NuxtStoryVariant title="Default">
            <VEmbedConsent
                name="YouTube"
                :class="$style.placeholder"
                @request="requestCount++"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.placeholder {
    max-width: 500px;
}
</style>

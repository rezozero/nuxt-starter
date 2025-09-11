<script lang="ts" setup>
import type { CaptchaProvider } from '~/utils/captcha/providers/defineCaptchaProvider'
import type { FormElementProps } from '~~/types/form'

const props = defineProps<FormElementProps>()

const id = useId()
const { providerName, siteKey } = useFormCaptcha({ input: props.name })

async function onProviderLoaded(provider: CaptchaProvider) {
    if (!allowLoadScript.value) return

    await provider.loadScript()
}

const {
    domAttributes,
    provider,
    allowLoadScript,
} = await useCaptchaProvider({ name: providerName, siteKey, id, onProviderLoaded })

watch(allowLoadScript, () => {
    if (!provider.value) return

    onProviderLoaded(provider.value)
}, { flush: 'post' })

onBeforeUnmount(async () => {
    provider.value?.remove?.()
})
</script>

<template>
    <div
        v-if="domAttributes"
        v-bind="domAttributes"
    />
</template>

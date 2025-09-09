<script lang="ts" setup>
import type { FormElementProps } from '~~/types/form'

const props = defineProps<FormElementProps>()

const { providerName, siteKey } = useFormCaptcha({ input: props.name })
const { domAttributes, captchaApi, allowLoadScript } = await useCaptchaProvider({ name: providerName, siteKey })

onMounted(init)
watch(allowLoadScript, init, { flush: 'post' })
watch(captchaApi, init, { flush: 'post' })

async function init() {
    if (!allowLoadScript.value || !captchaApi.value) return

    await captchaApi.value?.loadScript(siteKey.value)
}

onBeforeUnmount(async () => {
    captchaApi.value?.destroyWidget()
})
</script>

<template>
    <component
        :is="domAttributes.element || 'div'"
        v-if="domAttributes"
        v-bind="domAttributes"
    />
</template>

<script lang="ts" setup>
import type { CaptchaProvider } from '~/utils/captcha/providers/defineCaptchaProvider'
import type { FormElementProps } from '~~/types/form'

const props = defineProps<FormElementProps>()

const { t, te } = useI18n()
const id = useId()
const { providerName, siteKey } = useRoadizFormCaptcha(props.name)

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

// `ClientOnly` can resolve this async component before switching to its default slot on client-side
// navigation, leaving the widget unmounted — retry once the component is actually mounted.
onMounted(async () => {
    await nextTick()

    if (!provider.value || !allowLoadScript.value) return

    await onProviderLoaded(provider.value)
})

onBeforeUnmount(async () => {
    provider.value?.remove?.()
})

const _description = computed(() => {
    if (props.description) return props.description

    const key = `captcha.${providerName.value}.description`

    return te(key) ? t(key) : undefined
})
const { activeTheme } = useTheme()
</script>

<template>
    <VFieldWrapper
        :id="id"
        :description="_description"
        :disabled="props.disabled"
        :required="props.required"
        :errors="props.errors"
    >
        <template #default="scopedSlot">
            <ClientOnly>
                <section
                    v-if="domAttributes"
                    v-bind="domAttributes"
                    :aria-describedby="'describedby' in scopedSlot ? scopedSlot.describedby : undefined"
                    :class="[$style.captcha, domAttributes.class]"
                    aria-label="captcha"
                    data-allow-mismatch="children"
                    :data-theme="activeTheme || 'light'"
                />
                <template #fallback>
                    <div
                        :aria-busy="true"
                        :class="[$style.captcha, $style['captcha--fallback']]"
                    >
                        <VSpinner
                            size="24"
                            :class="$style.spinner"
                        />
                    </div>
                </template>
            </ClientOnly>
        </template>
    </VFieldWrapper>
</template>

<style lang="scss" module>
.captcha {
    min-height: 65px;
    margin-top: var(--form-control-margin-top, 6px);

    &--fallback {
        display: flex;
        width: 316px;
        align-items: center;
        justify-content: center;
        background-color: var(--form-control-background-color, #f5f5f5);
    }
}

.spinner {
    opacity: 0.3;
}
</style>

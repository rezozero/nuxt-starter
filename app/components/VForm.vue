<script lang="ts" setup>
import * as Sentry from '@sentry/nuxt'
import type { FetchError } from 'ofetch'
import type { PropType } from 'vue'
import { useJoinApiUrl } from '~/composables/use-join-api-url'
import type { ComponentsMap } from '~/utils/form/create-form-children'
import type { JsonSchemaExtended } from '~~/types/json-schema'
import type { Violation } from '~~/types/form'

interface FormSubmitParams {
    action?: string
    formData?: FormData
}

export type SubmitFunction = (arg: FormSubmitParams) => Promise<void>

const emit = defineEmits(['submit'])

// MODEL
const model = defineModel<Record<string, unknown>>({ default: {} })

const props = defineProps({
    schema: {
        type: [Object, String] as PropType<JsonSchemaExtended | string>,
        required: true,
    },
    componentsMap: Object as PropType<ComponentsMap>,
    method: {
        type: String,
        default: 'post',
    },
    action: {
        type: String as PropType<string | null>,
        default: () => '',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    allowSubmittingAgain: {
        type: Boolean,
        default: true,
    },
    gdpr: {
        type: [String, Boolean] as PropType<string | boolean>,
        default: true,
    },
    submitLabel: {
        type: String,
        default: undefined,
    },
    pendingLabel: {
        type: String,
        default: undefined,
    },
    successLabel: {
        type: String,
        default: undefined,
    },
    errorLabel: {
        type: String,
        default: undefined,
    },
    submitCallback: {
        type: Function as PropType<SubmitFunction>,
        required: false,
        default: undefined,
    },
    id: {
        type: String,
        default: '',
    },
})

// COMMONS
const { t, te } = useI18n()

// ERRORS
const error = ref<FetchError | null>(null)
const errorsPerProperty = computed(() => {
    const violations = error.value?.response?._data?.violations
    if (Array.isArray(violations) && violations.length > 0) {
        return violations
    }

    const errorsPerForm = error.value?.response?._data?.errorsPerForm as
        Record<string, string | (Record<string, string> & { code?: string })>

    if (!errorsPerForm) return []

    const apiCode = error.value?.response?._data?.code
    return Object.entries(errorsPerForm).map(([propertyPath, content]) => {
        return {
            propertyPath,
            message: (typeof content === 'string' ? content : content?.[propertyPath]) || '',
            code: (typeof content === 'object' ? content?.code : apiCode) || '',
        } as Violation
    })
})

watch(errorsPerProperty, (violations) => {
    if (!violations.length) return

    const target = formEl.value?.querySelector(`[name="${violations[0]?.propertyPath}"]`)

    if (target instanceof HTMLElement) {
        target.focus()
    }
})

const errorMessage = computed(() => {
    if (!error.value) return

    if (props.errorLabel) {
        return props.errorLabel
    }

    if (error.value?.response?.status === 429) {
        return t('form.error_too_many_requests')
    }

    return errorsPerProperty.value.length > 1 ? t('form.contains_errors') : t('form.error')
})

// SUBMIT
const canSubmit = computed(() => props.allowSubmittingAgain || !isSuccess.value)

const submitButtonLabel = computed(() => {
    if (isPending.value) return props.pendingLabel || t('form.pending')
    return props.submitLabel || t('form.submit')
})

const defaultSubmitCallback: SubmitFunction = async ({ action, formData }: FormSubmitParams) => {
    const url = action || useJoinApiUrl(useRoute().path)
    const fetch = useRoadizFetchFactory()

    // Error exception don't contain data
    return await fetch(url, {
        method: 'POST',
        body: formData,
    })
}

const formEl = ref<null | HTMLFormElement>(null)
const resetFormData = () => {
    formEl.value?.reset()
    model.value = {}
}

const formattedAction = computed(() => {
    if (!props.action) return

    return useJoinApiUrl(props.action)
})

// SUBMIT
async function onSubmit(event: Event): Promise<void> {
    emit('submit', event)

    if (event.defaultPrevented) return

    event.preventDefault()

    const form = event.target as HTMLFormElement
    const action = form.action
    const formData = new FormData(form)

    isPending.value = true
    error.value = null

    if (captchaEnabled.value && captchaInputKey.value && formData.has(captchaInputKey.value)) {
        const currentValue = formData.get(captchaInputKey.value)

        const token = await provider.value?.execute?.(typeof currentValue === 'string' ? currentValue : undefined)

        if (token) formData.set(captchaInputKey.value, token)
    }

    const submitCallback = props.submitCallback || defaultSubmitCallback
    const submitObject = { action, formData } as FormSubmitParams

    await submitCallback(submitObject)
        .then(() => {
            isSuccess.value = true
            resetFormData()
        })
        .catch((submitError: FetchError) => {
            isSuccess.value = false
            error.value = submitError

            Sentry.captureException(submitError)
        })
        .finally(() => {
            isPending.value = false
        })
}

// SCHEMA
const { data: loadedSchema } = typeof props.schema === 'string' ? await useRoadizFetch<JsonSchemaExtended>(useJoinApiUrl(props.schema)) : { data: null }

const gdprContent = computed(() => {
    if (typeof props.gdpr === 'string' && props.gdpr.trim() !== '') {
        return props.gdpr
    }

    if (typeof props.gdpr === 'boolean' && props.gdpr && te('form.gdpr')) {
        return t('form.gdpr')
    }

    return null
})

const rawSchema = computed(() => (typeof props.schema === 'object' ? props.schema : loadedSchema?.value))
const formattedSchema = computed(() => {
    if (!rawSchema.value) {
        return
    }

    const schema = { ...rawSchema.value }

    return schema
})

// CAPTCHA
const captchaInputKey = computed(() => {
    const fieldKeys = Object.keys(toValue(formattedSchema.value?.properties) || {})

    return fieldKeys.find(key => !!getValidCaptchaKey(key))
})

const {
    providerName,
    siteKey: captchaSiteKey,
    enabled: captchaEnabled,
} = useRoadizFormCaptcha(captchaInputKey)

const {
    provider,
    displayUserConsentDialog,
    userConsent,
} = await useCaptchaProvider({ name: providerName, siteKey: captchaSiteKey })

// STATE
const isPending = ref(false)
const isSuccess = ref(false)
const isDisabled = computed(() => props.disabled || isPending.value || displayUserConsentDialog.value)
</script>

<template>
    <form
        v-if="formattedSchema"
        :id="id"
        ref="formEl"
        :action="formattedAction"
        :method="method"
        @submit="(e) => onSubmit(e)"
    >
        <dialog
            v-if="displayUserConsentDialog"
            open
            :class="$style['consent-dialog']"
        >
            <p>{{ $t('form.user_cookie_consent.message') }}</p>
            <button @click="() => userConsent = true">
                {{ $t('form.user_cookie_consent.button_label') }}
            </button>
        </dialog>
        <slot name="beforeFields" />
        <VFormElementFactory
            :id="id"
            v-model="model"
            :components-map="componentsMap"
            :disabled="disabled"
            :errors="errorsPerProperty"
            :schema="formattedSchema"
        />
        <footer>
            <LazyVStatusBanner
                v-if="errorMessage"
                status="error"
                :message="errorMessage"
                :class="$style.error"
                role="alert"
            />
            <LazyVStatusBanner
                v-if="isSuccess"
                status="success"
                :message="successLabel || t('form.success')"
                :class="$style.success"
                role="status"
            />
            <slot
                v-if="!isSuccess"
                name="submitButton"
                v-bind="{
                    canSubmit,
                    isPending,
                    isDisabled,
                    error,
                    label: submitButtonLabel,
                }"
            >
                <VButton
                    v-if="canSubmit"
                    :disabled="isDisabled"
                    :label="submitButtonLabel"
                    :class="$style.submit"
                />
            </slot>
            <VMarkdown
                v-if="gdprContent"
                :class="$style.gdpr"
                :content="gdprContent"
                class="text-body-xs"
                inline
                tag="p"
            />
        </footer>
    </form>
</template>

<style lang="scss" module>
.consent-dialog {
    z-index: 1;
}

.error {
    margin-block: 18px;
}

.success {
    margin-block: 18px;
}

.submit {
    --v-button-display: flex;

    margin-block: 32px 18px;
}

.gdpr {
    margin-top: 32px;
    color: var(--v-form-gdpr-color, rgb(117 117 117));
}
</style>

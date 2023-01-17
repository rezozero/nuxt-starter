<template>
    <form
        v-if="formattedSchema"
        :id="id"
        :method="method"
        :action="formattedAction"
        :class="$style.root"
        @submit="onSubmit"
        @reset="onReset"
    >
        <slot name="beforeFields" />
        <v-form-fields
            :id="id || 'form'"
            :data="internalData"
            :schema="formattedSchema"
            :errors="errorsPerProperty"
            :disabled="isDisabled"
            @input="onInput"
        />
        <div :class="$style.footer">
            <div :class="$style.actions">
                <div v-if="errorMessage" :class="$style.errors">{{ errorMessage }}</div>
                <div v-if="isSuccess && successLabel !== false">
                    {{ successLabel || $t('form.success') }}
                </div>
                <v-button v-if="!isSuccess" filled :disabled="isDisabled" :class="$style.actions__button">
                    {{ submitButtonLabel }}
                </v-button>
            </div>
            <div :class="$style.infos">
                <p v-if="gdpr">{{ $t('form.gdpr') }}</p>
                <p v-if="recaptcha && recaptchaEnabled" v-html="$t('form.recaptcha')"></p>
            </div>
        </div>
    </form>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import Vue from 'vue'
import { AxiosError } from 'axios'
import VButton from '~/components/molecules/VButton/VButton.vue'
import { JsonSchemaExtended } from '~/types/json-schema'

export interface FormSubmitParams {
    action?: string
    data?: FormData
}

// @see https://github.com/microsoft/TypeScript/issues/36217#issuecomment-600885388
interface FormDataEvent extends Event {
    readonly formData: FormData
}

export const RECAPTCHA_INPUT = 'g-recaptcha-response'

export default Vue.extend({
    name: 'VForm',
    components: { VButton },
    props: {
        data: Object as PropType<Record<string, string>>,
        schema: [Object, String] as PropType<JsonSchemaExtended | string>,
        method: {
            type: String,
            default: 'post',
        },
        action: String,
        disabled: Boolean,
        gdpr: {
            type: Boolean,
            default: true,
        },
        submitLabel: String,
        pendingLabel: String,
        successLabel: {
            type: [String, Boolean],
            default: undefined,
        },
        errorLabel: String,
        submitCallback: Function,
        id: String,
    },
    data() {
        return {
            isPending: false,
            isSuccess: false,
            error: null as AxiosError | null,
            internalData: this.data || {},
            loadedSchema: null as null | JsonSchemaExtended,
        }
    },
    async fetch() {
        if (typeof this.schema === 'string' && !this.loadedSchema) {
            // the url returned by the API has already the endpoint prefix
            const url = this.$roadizURL(this.schema)

            this.loadedSchema =
                (await this.$roadiz?.get<JsonSchemaExtended>(url).then((response) => response.data)) || null
        }
    },
    computed: {
        rawSchema(): JsonSchemaExtended | undefined | null {
            return typeof this.schema === 'object' ? this.schema : this.loadedSchema
        },
        formattedSchema(): JsonSchemaExtended | undefined | null {
            if (!this.rawSchema) return

            const schema = Object.assign({}, this.rawSchema)

            // remove recaptcha
            delete schema.properties?.recaptcha
            if (schema.required && Array.isArray(schema.required)) {
                schema.required = schema.required.filter((value) => value !== 'recaptcha')
            }

            return schema
        },
        formattedAction(): string | undefined {
            if (!this.action) return

            return this.$roadizURL(this.action)
        },
        isDisabled(): boolean {
            return this.disabled || this.isPending
        },
        submitButtonLabel(): string {
            return this.isPending
                ? this.pendingLabel || this.$t('form.pending').toString()
                : this.submitLabel || this.$t('form.submit').toString()
        },
        errorsPerProperty(): Record<string, Record<string, string>> | undefined {
            // custom form error
            return this.error?.response?.data?.errorsPerForm
        },
        errorMessage(): string | undefined | boolean {
            if (!this.error) return

            if (this.errorLabel) return this.errorLabel

            if (this.errorsPerProperty || this.error.response?.status === 400) {
                const countErrors = this.errorsPerProperty ? Object.keys(this.errorsPerProperty).length : 0

                return this.$tc('form.error', countErrors).toString()
            }

            if (this.error.response?.status === 429) {
                return this.$t('form.error_too_many_requests').toString()
            }

            return this.error.message
        },
        recaptcha(): JsonSchemaExtended | undefined {
            return this.rawSchema?.properties?.[RECAPTCHA_INPUT]
        },
        recaptchaEnabled(): boolean {
            return !!this.recaptcha && Boolean(this.$config.recaptcha?.siteKey)
        },
    },
    async mounted() {
        if (this.recaptchaEnabled) await this.$recaptcha?.init()
    },
    beforeDestroy() {
        this.$recaptcha?.destroy()
    },
    methods: {
        defaultSubmitCallback({ action, data }: FormSubmitParams) {
            const url = action || this.$route.params.pathMatch

            return this.$roadiz?.axios.post(url, data) || Promise.resolve()
        },
        async onSubmit(event: FormDataEvent): Promise<void> {
            this.$emit('submit', event)

            if (event.defaultPrevented) return

            event.preventDefault()

            const form = event.target as HTMLFormElement
            const action = form.action
            const formData = new FormData(form)

            if (this.recaptchaEnabled && formData.has(RECAPTCHA_INPUT)) {
                const token = await this.$recaptcha?.execute('form')

                if (token) formData.set(RECAPTCHA_INPUT, token)
            }

            this.isPending = true
            this.error = null

            const submitCallback = this.submitCallback || this.defaultSubmitCallback

            await submitCallback({ action, data: formData })
                .then(() => {
                    this.isSuccess = true
                })
                .catch((error: AxiosError) => {
                    this.error = error
                })

            this.isPending = false
        },
        onInput(value: string, { name }: { name?: string } = {}) {
            if (!name) return

            this.internalData = { ...this.internalData, [name]: value }
        },
        onResetClick() {
            this.isSuccess = false
            ;(this.$el as HTMLFormElement).reset()
        },
        onReset() {
            this.internalData = {}
        },
    },
})
</script>

<style lang="scss" module>
.root {
    max-width: 750px;
}

.footer {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding: rem(30) 0 0;

    @include media('>=md') {
        flex-direction: row;
        justify-content: flex-end;
    }
}

.actions {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: flex-end;
}

.errors {
    color: red;
}

.actions__button {
    flex-shrink: 0;
    margin-left: rem(20);
}

.infos {
    margin-top: rem(31);
}

.infos p {
    margin-bottom: 1em;
}

.infos a {
    text-decoration: underline;
}
</style>

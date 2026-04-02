<script lang="ts" setup>
import type { FormElementProps } from '~~/types/form'

const props = defineProps<{
    tag?: string
    labelTag?: string
    focused?: boolean
    filled?: boolean
} & FormElementProps>()

const descriptionId = computed(() => (props.description ? `description-${props.id}` : undefined))
const _errors = computed(() => {
    return props.errors?.map((error, index) => ({
        ...error,
        id: `error-${index}-${props.id}`,
    }))
})

const describedby = computed(() => {
    const results = []
    if (props.description) {
        results.push(descriptionId.value)
    }

    _errors.value?.forEach((error) => {
        results.push(error.id)
    })

    return results.join(' ')
})

const needLabel = computed(() => props.tag !== 'fieldset' && props.labelTag !== 'legend')
</script>

<template>
    <component
        :is="tag || 'div'"
        :class="$style.root"
    >
        <slot name="beforeLabel" />
        <component
            :is="labelTag || 'label'"
            v-if="label"
            :class="$style.label"
            :for="needLabel ? id : undefined"
        >
            {{ label }}
            <VRequiredMark v-if="required" />
        </component>

        <p
            v-if="description"
            :id="descriptionId"
            :class="$style.description"
        >
            {{ description }}
        </p>

        <slot :describedby="describedby" />

        <div
            v-if="errors?.length"
            :class="$style.errors"
            role="alert"
        >
            <LazyVStatusBanner
                v-for="violation in _errors"
                :id="violation.id"
                :key="violation.id"
                status="error"
                :message="violation.message"
            />
        </div>
    </component>
</template>

<style lang="scss" module>
.root {
    position: relative;
    margin-top: var(--v-field-wrapper-margin-top, 16px);

    // Add grid layout on checkboxes and radios wrapper
    // to align input and label, and set description under label
    &:not(fieldset):has(> input[type="checkbox"]),
    &:not(fieldset):has(> input[type="radio"]) {
        display: grid;
        width: 100%;
        grid-template-columns: auto 1fr;

        .description {
            grid-column: 2 / -1;
        }

        .errors {
            grid-column: 1 / -1;
        }
    }
}

fieldset.root {
    border-width: 1px;
    border-style: solid;
    border-color: var(--form-fields-on-light-border, rgb(0, 0, 0, 20%));
    border-radius: var(--v-field-wrapper-border-radius, var(--form-control-border-radius));
    margin-top: var(--v-field-wrapper-margin-top, 24px);
    padding-block: 0 var(--spacing-md, 24px);
    padding-inline: var(--spacing-xl, 32px);

    legend {
        padding-inline: var(--spacing-6xs, 4px);
    }
}

.label {
    display: inline-block;
    color: var(--v-field-wrapper-label-color, currentColor);
    font-size: var(--v-field-wrapper-label-size, 16px);
}

.description {
    color: var(--form-fields-on-light-supporting-text, rgb(0, 0, 0, 60%));
    font-size: var(--v-field-wrapper-meta-font-size, 12px);
    margin-block: 6px 0;
}

.errors {
    margin-top: 8px;
    font-size: var(--v-field-wrapper-meta-font-size);
}
</style>

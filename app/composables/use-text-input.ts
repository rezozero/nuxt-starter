import type { Ref } from 'vue'
import type { FormElementProps } from '~~/types/form'

type EmitFunction = (event: string, value?: string) => void
type textInputElement = HTMLInputElement | HTMLTextAreaElement
export const textInputEmits = ['update:modelValue']

export function useTextInput(
    props: FormElementProps,
    emit: EmitFunction,
    element: Ref<textInputElement | null>,
) {
    const isFocused = ref(false)
    const model = ref(props.modelValue)

    const isFilled = computed(() => typeof model.value === 'string' && model.value.length > 0)

    const onBlur = () => {
        isFocused.value = false
    }

    const onFocus = () => {
        isFocused.value = true
    }

    const onInput = (event: Event) => {
        const el = event.target as textInputElement
        if (!el) return
        model.value = el.value
    }

    watch(
        () => props.modelValue,
        v => (model.value = v),
    )

    watch(model, (value) => {
        if (typeof value !== 'string') return

        const nextValue = value.length > 0 ? value : undefined
        if (nextValue === props.modelValue) return

        emit('update:modelValue', nextValue)
    })

    onMounted(() => {
        // possibly autofilled — skip checkboxes/radios (their default .value is "on")
        const type = element.value?.type
        if (!model.value && type !== 'checkbox' && type !== 'radio') {
            if (element.value) model.value = element.value.value
        }
    })

    return {
        isFocused,
        model,
        isFilled,
        onBlur,
        onFocus,
        onInput,
    }
}

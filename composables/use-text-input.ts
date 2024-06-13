import type { Ref } from 'vue'
import type { FormElementProps } from '~/types/form'

export interface TextInputProps extends FormElementProps {
    modelValue?: string
}

type EmitFunction = (event: string, value?: string) => void

export const textInputEmits = ['update:modelValue']

export function useTextInput(props: TextInputProps, emit: EmitFunction, element: Ref<HTMLInputElement | null>) {
    const isFocused = ref(false)
    const model = ref(props.modelValue)

    const isFilled = computed(() => !!model.value?.length)

    const onBlur = () => {
        isFocused.value = false
    }

    const onFocus = () => {
        isFocused.value = true
    }

    const onInput = (event: Event) => {
        model.value = (event.target as HTMLInputElement).value
    }

    watch(
        () => props.modelValue,
        v => (model.value = v),
    )

    watch(model, (value) => {
        emit('update:modelValue', value)
    })

    onMounted(() => {
        // possibly autofilled
        if (!model.value) {
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

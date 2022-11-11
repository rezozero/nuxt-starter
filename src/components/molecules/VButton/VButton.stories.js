import VButton from '~/components/molecules/VButton/VButton.vue'
import IconChevronRight from '~/assets/images/icons/chevron-right.svg?inline'

export default {
    title: 'Molecules/Button',
    component: VButton,
    argTypes: {
        theme: {
            options: ['dark', 'light'],
        },
        color: {
            options: ['primary', 'secondary'],
        },
        size: {
            options: ['sm', 'md', 'lg'],
        },
        direction: {
            options: ['ltr', 'rtl'],
        },
    },
    args: {
        label: 'Button',
    },
}

const Template = (_args, { argTypes }) => {
    return {
        props: Object.keys(argTypes).concat(['label']),
        components: { VButton, IconChevronRight },
        template: `
            <v-button v-bind="$props">
                <template #default v-if="label">
                    {{ label }}
                </template>
                <template #icon v-if="icon">
                    <component :is="icon" />
                </template>
            </v-button>
        `,
    }
}

export const Filled = Template.bind({})
Filled.args = {
    filled: true,
}

export const OutlinedSizeSmall = Template.bind({})
OutlinedSizeSmall.args = {
    size: 'sm',
    outlined: true,
}

export const OutlinedTextAndIcon = Template.bind({})
OutlinedTextAndIcon.args = {
    outlined: true,
    icon: 'IconChevronRight',
}

export const TextAndIcon = Template.bind({})
TextAndIcon.args = {
    icon: 'IconChevronRight',
}

export const Text = Template.bind({})
Text.args = {}

export const OutlinedIcon = Template.bind({})
OutlinedIcon.args = {
    outlined: true,
    label: false,
    icon: 'IconChevronRight',
}

OutlinedIcon.parameters = {
    controls: {
        exclude: ['label'],
    },
}

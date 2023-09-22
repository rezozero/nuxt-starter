import type { Meta, StoryObj } from '@storybook/vue3'
import VInputList from '~/components/molecules/VInputList/VInputList.vue'

type Story = StoryObj<typeof VInputList>

const meta: Meta<typeof VInputList> = {
    component: VInputList,
}

export default meta

export const Default: Story = {
    render: (args) => ({
        components: { VInputList },
        setup() {
            return { args }
        },
        template: '<VInputList v-bind="args" />',
    }),
    args: {
        options: [...new Array(6)].map((_value, index) => index),
    },
}

import type { Meta, StoryObj } from '@storybook/vue3'
import VInput from '~/components/molecules/VInput/VInput.vue'

type Story = StoryObj<typeof VInput>

const meta: Meta<typeof VInput> = {
    component: VInput,
}

export default meta

export const Default: Story = {
    render: () => ({
        components: { VInput },
        template: '<VInput />',
    }),
}

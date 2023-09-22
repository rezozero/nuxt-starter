import type { Meta, StoryObj } from '@storybook/vue3'
import VRequiredMark from './VRequiredMark.vue'

type Story = StoryObj<typeof VRequiredMark>

const meta: Meta<typeof VRequiredMark> = {
    component: VRequiredMark,
}

export default meta

export const Default: Story = {
    render: () => ({
        components: { VRequiredMark },
        template: '<VRequiredMark />',
    }),
}

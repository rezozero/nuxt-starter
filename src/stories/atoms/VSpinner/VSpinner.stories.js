import VSpinner from '~/components/atoms/VSpinner'

export default {
    title: 'atoms/Spinner',
    component: VSpinner,
    decorators: [
        () => ({
            template: `<div style="width: 100px; height: 100px"><story /></div>`,
        }),
    ],
}

export const Default = () => ({
    template: `<v-spinner />`,
})

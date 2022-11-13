import VSelect from '~/components/organisms/VSelect/VSelect'

export default {
    title: 'organisms/Select',
    component: VSelect,
    decorators: [
        () => ({
            template: `<div style="max-width: 500px"><story /></div>`,
        }),
    ],
    args: {
        label: 'Select an option',
    },
}

const Template = (_args, { argTypes }) => {
    return {
        props: Object.keys(argTypes).concat(['label']),
        components: { VSelect },
        template: `<v-select v-bind="$props" />`,
    }
}

function createOptions(length) {
    return Array.from({ length }, (_value, index) => ({ label: `Option ${index + 1}`, value: index + 1 }))
}

export const Default = Template.bind({})
Default.args = {
    options: createOptions(2),
}

export const Multiple = Template.bind({})
Multiple.args = {
    options: createOptions(2),
    multiple: true,
}

export const Long = Template.bind({})
Long.args = {
    options: createOptions(100),
}

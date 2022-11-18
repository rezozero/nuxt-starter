import VImage from '~/components/molecules/VImage/VImage'
import { createImage } from '~/utils/storybook/document'

export default {
    title: 'molecules/Image',
    component: VImage,
    argTypes: {
        copyright: {
            control: 'boolean',
        },
    },
}

const Template = (_args, { argTypes }) => {
    return {
        props: Object.keys(argTypes),
        components: { VImage },
        template: `<v-image v-bind="$props" />`,
    }
}

export const Default = Template.bind({})
Default.args = {
    document: createImage({ relativePath: '01.jpg', imageWidth: '300', imageHeight: '200' }),
}

import VImage from '~/components/molecules/VImage/VImage'
import { createImage } from '~/utils/storybook/document'

export default {
    title: 'molecules/VImage',
    component: VImage,
    argTypes: {
        copyright: {
            control: 'boolean',
        },
    },
    decorators: [
        () => ({
            template: `<div style="max-width:800px"><story /></div>`,
        }),
    ],
}

const Template = (_args, { argTypes }) => {
    return {
        props: Object.keys(argTypes),
        template: `<v-image v-bind="$props" />`,
    }
}

export const Default = Template.bind({})
Default.args = {
    document: createImage({ relativePath: '01.jpg', imageWidth: '300', imageHeight: '200' }),
}

export const Crop = Template.bind({})
Crop.args = {
    ...Default.args,
    crop: '200x200',
}

export const CustomSources = () => {
    return {
        data() {
            return {
                document: createImage({ relativePath: '01.jpg', imageWidth: '300', imageHeight: '200' }),
            }
        },
        components: { VImage },
        template: `<v-image :document="document" :ratio="false">
            <v-image-source :src="document.relativePath" sizes="xs:100vw md:100vw" media="(max-width: 767px)" crop="200x300" />
            <v-image-source :src="document.relativePath" sizes="md:100vw lg:100vw xl:100vw" />
        </v-image>`,
    }
}

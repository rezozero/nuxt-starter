import VMedia from '~/components/molecules/VMedia/VMedia'
import { createDocument, createImage } from '~/utils/storybook/document'

export default {
    title: 'molecules/Media',
    component: VMedia,
    decorators: [() => ({ template: '<div style="max-width: 1440px"><story /></div>' })],
}

const Template = (_args, { argTypes }) => {
    return {
        props: Object.keys(argTypes),
        components: { VMedia },
        template: `<v-media v-bind="$props" />`,
    }
}

export const VideoYoutube = Template.bind({})
VideoYoutube.args = {
    autoplay: true,
    muted: true,
    document: createDocument({ embedPlatform: 'youtube', embedId: 'uETYWUty8h8' }),
}

export const Image = Template.bind({})
Image.args = {
    autoplay: true,
    muted: true,
    document: createImage({ relativePath: '01.jpg', imageWidth: '300', imageHeight: '200' }),
}

export const Audio = Template.bind({})
Audio.args = {
    autoplay: true,
    muted: true,
    document: createDocument({ embedPlatform: 'spotify', embedId: 'playlist/01wPtYA575JEMsEuRNdyMQ' }),
}

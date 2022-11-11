// eslint-disable-next-line import/no-webpack-loader-syntax
import mp3File from 'file-loader!./01.mp3'
import VAudio from '~/components/molecules/VAudio'
import { createDocument } from '~/utils/storybook/document'

export default {
    title: 'molecules/Audio',
    component: VAudio,
    decorators: [() => ({ template: '<div style="max-width: 1440px"><story /></div>' })],
}

const Template = (_args, { argTypes }) => {
    return {
        props: Object.keys(argTypes),
        components: { VAudio },
        template: `<v-audio v-bind="$props" />`,
    }
}

export const Spotify = Template.bind({})
Spotify.args = {
    document: createDocument({ embedPlatform: 'spotify', embedId: 'playlist/01wPtYA575JEMsEuRNdyMQ' }),
}

export const Deezer = Template.bind({})
Deezer.args = {
    document: createDocument({ embedPlatform: 'deezer', embedId: 'playlist/5802979062' }),
}

export const Soundcloud = Template.bind({})
Soundcloud.args = {
    document: createDocument({ embedPlatform: 'soundcloud', embedId: 'https://api.soundcloud.com/tracks/1177578853' }),
}

export const Mp3 = Template.bind({})
Mp3.args = {
    muted: true,
    document: createDocument({ relativePath: 'http://localhost:3003/' + mp3File }),
}

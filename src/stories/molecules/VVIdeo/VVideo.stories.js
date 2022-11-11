import VVideo from '~/components/molecules/VVideo'
import Resize from '~/mixins/Resize'
import { createDocument } from '~/utils/storybook/document'

export default {
    title: 'molecules/Video',
    component: VVideo,
    decorators: [() => ({ template: '<div style="max-width: 1440px"><story /></div>' })],
}

const Template = (_args, { argTypes }) => {
    return {
        props: Object.keys(argTypes),
        mixins: [Resize],
        components: { VVideo },
        template: `<v-video v-bind="$props" />`,
    }
}

export const Youtube = Template.bind({})
Youtube.args = {
    muted: true,
    document: createDocument({ embedPlatform: 'youtube', embedId: 'uETYWUty8h8' }),
}

export const Vimeo = Template.bind({})
Vimeo.args = {
    muted: true,
    document: createDocument({ embedPlatform: 'vimeo', embedId: '21372266' }),
}

export const Mp4 = Template.bind({})
Mp4.args = {
    muted: true,
    document: createDocument({ relativePath: '/videos/01.mp4' }),
}

export const YoutubeBackground = Template.bind({})
YoutubeBackground.args = {
    background: true,
    document: createDocument({ embedPlatform: 'youtube', embedId: 'uETYWUty8h8' }),
}

export const YoutubeBackgroundCover = Template.bind({})
YoutubeBackgroundCover.args = {
    background: true,
    fit: 'cover',
    document: createDocument({ embedPlatform: 'youtube', embedId: 'uETYWUty8h8' }),
}
YoutubeBackgroundCover.decorators = [
    () => ({ template: '<div style="position: relative; width: 500px; height: 500px;"><story /></div>' }),
]

export const YoutubeFullscreenBackgroundCover = Template.bind({})
YoutubeFullscreenBackgroundCover.args = {
    background: true,
    fit: 'cover',
    document: createDocument({ embedPlatform: 'youtube', embedId: 'uETYWUty8h8' }),
}
YoutubeFullscreenBackgroundCover.parameters = {
    layout: 'fullscreen',
}
YoutubeFullscreenBackgroundCover.decorators = [
    () => ({ template: '<div style="position: absolute; width: 100%; height: 100%;"><story /></div>' }),
]

export const VimeoFullscreenBackgroundCover = Template.bind({})
VimeoFullscreenBackgroundCover.args = {
    background: true,
    fit: 'cover',
    document: createDocument({ embedPlatform: 'vimeo', embedId: '21372266' }),
}
VimeoFullscreenBackgroundCover.parameters = {
    layout: 'fullscreen',
    backgrounds: {
        default: 'dark',
    },
}
VimeoFullscreenBackgroundCover.decorators = [
    () => ({ template: '<div style="position: absolute; width: 100%; height: 100%;"><story /></div>' }),
]

export const Mp4FullscreenBackgroundCover = Template.bind({})
Mp4FullscreenBackgroundCover.args = {
    background: true,
    fit: 'cover',
    document: createDocument({ relativePath: '/videos/01.mp4' }),
}
Mp4FullscreenBackgroundCover.parameters = {
    layout: 'fullscreen',
    backgrounds: {
        default: 'dark',
    },
}
Mp4FullscreenBackgroundCover.decorators = [
    () => ({ template: '<div style="position: absolute; width: 100%; height: 100%;"><story /></div>' }),
]

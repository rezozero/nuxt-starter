import VLink from '~/components/molecules/VLink/VLink.vue'
import { createImage } from '~/utils/storybook/document'

export default {
    component: VLink,
}

const Template = (_args, { argTypes }) => {
    return {
        props: Object.keys(argTypes),
        template: `<v-link v-bind="$props" />`,
    }
}

const NestedTemplate = (_args, { argTypes }) => {
    return {
        props: Object.keys(argTypes),
        template: `<h1>
          <v-link v-bind="$props">Title</v-link>
        </h1>`,
    }
}

export const LabelOnly = Template.bind({})
LabelOnly.args = {
    label: 'Test',
}

export const Blank = Template.bind({})
Blank.args = {}

export const InternalReference = Template.bind({})
InternalReference.args = {
    reference: [
        {
            title: 'Internal reference',
            url: '/internal-page',
        },
    ],
}

export const ExternalURL = Template.bind({})
ExternalURL.args = {
    label: 'External URL',
    url: 'https://rezo-zero.com',
}

export const ExternalURLWithoutLabel = Template.bind({})
ExternalURLWithoutLabel.args = {
    url: 'https://rezo-zero.com',
}

export const Document = Template.bind({})
Document.args = {
    document: [createImage({ relativePath: '01.jpg', alt: 'Document test' })],
}

export const DocumentAndInternalReference = Template.bind({})
DocumentAndInternalReference.args = {
    document: [createImage({ relativePath: '01.jpg', alt: 'Document test' })],
    reference: [
        {
            title: 'Internal reference',
            url: '/internal-reference',
        },
    ],
}

export const DocumentAndExternalURL = Template.bind({})
DocumentAndExternalURL.args = {
    document: [createImage({ relativePath: '01.jpg', alt: 'Document test' })],
    url: 'https://rezo-zero.com',
}

export const EventReference = Template.bind({})
EventReference.args = {
    reference: {
        name: 'Event name',
        url: '/event',
    },
}

export const NestedLabel = NestedTemplate.bind({})
NestedLabel.args = {
    label: 'Test',
}

export const NestedExternalURL = NestedTemplate.bind({})
NestedExternalURL.args = {
    url: 'https://rezo-zero.com',
}

export const Image = () => {
    return {
        data() {
            return {
                document: createImage({ relativePath: '01.jpg', imageWidth: '300', imageHeight: '200' }),
            }
        },
        template: `<div style="max-width: 200px">
            <v-link url="https://rezo-zero.com">
              <v-image :document="document"  />
            </v-link>
        </div>`,
    }
}

export const NativeImage = () => {
    return {
        data() {
            return {
                document: createImage({ relativePath: '01.jpg', imageWidth: '300', imageHeight: '200' }),
            }
        },
        template: `<div style="max-width: 200px">
            <v-link url="https://rezo-zero.com">
              <img :src="'/images/' + document.relativePath" style="max-width: 100%" />
            </v-link>
        </div>`,
    }
}

export const Span = () => {
    return {
        template: `<v-link url="https://rezo-zero.com">
            <span>Test</span>
        </v-link>`,
    }
}

export const Custom = () => {
    return {
        template: `<v-link url="https://rezo-zero.com" custom v-slot="{ href, label }">
            <a :href="href">{{ label }}</a>
        </v-link>`,
    }
}

import IconCheck from '~/assets/images/icons/check.svg?sprite'
import VLinkButton from '~/components/molecules/VLinkButton/VLinkButton.vue'
import { createImage } from '~/utils/storybook/document'

export default {
    title: 'molecules/VlinkButton',
    component: VLinkButton,
}

const Template = (_args, { argTypes }) => {
    return {
        props: Object.keys(argTypes),
        template: `<v-link-button v-bind="$props" />`,
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
    label: 'Test',
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

export const EventReference = Template.bind({})
EventReference.args = {
    reference: {
        name: 'Event name',
        url: '/event',
    },
}

export const IconOnly = (_args, { argTypes }) => {
    return {
        components: { IconCheck },
        props: Object.keys(argTypes),
        template: `<v-link-button outlined v-bind="$props">
          <template #icon>
              <icon-check />
          </template>
        </v-link-button>`,
    }
}
IconOnly.args = {
    url: 'https://rezo-zero.com',
}

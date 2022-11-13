import VCollapsable from '~/components/molecules/VCollapsable/VCollapsable'
import VButton from '~/components/molecules/VButton/VButton'
import IconChevronRight from '~/assets/images/icons/chevron-right.svg'

export default {
    title: 'Molecules/Collapsable',
    component: VCollapsable,
    decorators: [() => ({ template: `<div style="max-width: 800px"><story /></div>` })],
}

const Template = (args, { argTypes }) => {
    return {
        props: Object.keys(argTypes).filter((arg) => arg !== 'collapsed'),
        components: { VButton, IconChevronRight },
        data() {
            return {
                collapsed: args.collapsed,
            }
        },
        template: `
            <v-collapsable v-slot="{ toggle }" v-model="collapsed" :enabled="$props.enabled">
                <div>
                  <v-collapsable-header :enabled="$props.enabled" :collapsed="collapsed" :toggle="toggle">
                      <div>Header</div>
                  </v-collapsable-header>
                  <v-collapsable-main :enabled="$props.enabled" :collapsed="collapsed">
                      <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
                  </v-collapsable-main>
                </div>
            </v-collapsable>
        `,
    }
}

export const Default = Template.bind({})
Default.args = {
    enabled: true,
    collapsed: true,
}

export const Disabled = Template.bind({})
Disabled.args = {
    enabled: false,
    collapsed: true,
}

export const Expanded = Template.bind({})
Expanded.args = {
    enabled: true,
    collapsed: false,
}

import VBadge from '~/components/atoms/VBadge.vue'
import VButton from '~/components/molecules/VButton.vue'

export default {
    title: 'Atoms/Badge',
    component: VBadge,
}

export const Default = () => {
    return {
        components: { VBadge },
        template: `
                <v-badge :value="2" />
        `,
    }
}

export const WithContext = () => {
    return {
        components: { VBadge, VButton },
        template: `
            <div style="position: relative;display: inline-block;">
                <v-button rounded outlined>Notifications</v-button>
                <v-badge style="position: absolute;top: -4px;right: 0;" :value="2" />
            </div>
        `,
    }
}

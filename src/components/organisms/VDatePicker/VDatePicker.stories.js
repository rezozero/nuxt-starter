import { addMonths, endOfMonth, endOfWeek, startOfMonth } from 'date-fns'
import VDatePicker from '~/components/organisms/VDatePicker/VDatePicker.vue'

export default {
    title: 'Molecules/DatePicker',
    component: { VDatePicker },
}

export const Default = () => ({
    data() {
        return {
            selectedDate: null,
        }
    },
    methods: {
        clear() {
            this.selectedDate = null
        },
        selectWeek() {
            this.selectedDate = { start: new Date(), end: endOfWeek(new Date(), { weekStartsOn: 1 }) }
        },
        selectNextMonth() {
            this.selectedDate = {
                start: startOfMonth(addMonths(new Date(), 1)),
                end: endOfMonth(addMonths(new Date(), 1)),
            }
        },
    },
    template: `
        <div>
            <v-date-picker v-model="selectedDate" />
            <p>{{selectedDate}}</p>
            <v-button @click="clear" style="margin-right: 20px">Reset</v-button>
            <v-button @click="selectWeek" style="margin-right: 20px">This week</v-button>
            <v-button @click="selectNextMonth" style="margin-right: 20px">Next month</v-button>
        </div>
    `,
})

import Vue, { PropType } from 'vue'
import {RoadizWalker} from "@roadiz/abstract-api-client/dist/types/roadiz";

export default Vue.extend({
    props: {
        walker: Object as PropType<RoadizWalker>,
        index: Number,
    },
})

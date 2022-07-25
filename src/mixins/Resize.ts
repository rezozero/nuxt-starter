import Vue from 'vue'
import { throttle } from 'throttle-debounce'
import MutationType from '~/constants/mutation-type'
import eventBus from '~/utils/event-bus'
import EventType from '~/constants/event-type'

export default Vue.extend({
    data() {
        return {
            resizeCallback: throttle(200, (this as any).onResize),
        }
    },
    beforeMount() {
        this.setWindowSize()
        this.setScrollBarWidth()
    },
    mounted() {
        window.addEventListener('resize', this.resizeCallback)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeCallback)
    },
    methods: {
        setWindowSize() {
            this.$store.commit(MutationType.WINDOW_WIDTH, window.innerWidth)
            this.$store.commit(MutationType.WINDOW_HEIGHT, window.innerHeight)
        },
        setScrollBarWidth() {
            document.documentElement.style.setProperty(
                '--scroll-bar-width',
                window.innerWidth - document.documentElement.clientWidth + 'px'
            )
        },
        onResize() {
            this.setWindowSize()
            this.setScrollBarWidth()

            eventBus.$emit(EventType.RESIZE)
        },
    },
})

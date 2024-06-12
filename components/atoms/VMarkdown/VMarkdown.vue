<script lang="ts">
import { marked } from 'marked'
import { getSlotChildrenText } from '~/utils/vue/get-slot-children-text'

const renderer = new marked.Renderer()
const linkRenderer = renderer.link

renderer.link = (href: string, title: string, text: string) => {
    let html = linkRenderer.call(renderer, href, title, text)

    if (href && href.startsWith('http') && !html.includes('target="_blank"')) {
        html = html.replace(/^<a /, '<a target="_blank" ')
    }

    // All downloadable links (with an extension) should open in a new tab
    if (href && href.match(/\.(?!html|php)([a-z0-9]{3,4})$/i) && !html.includes('_blank')) {
        html = html.replace(/^<a /, '<a target="_blank" ')
    }

    return html
}

export default defineComponent({
    props: {
        content: String, // use this prop or directly default slot
        inline: Boolean,
        parsed: Boolean,
        tag: String,
    },
    setup(props, { slots }) {
        const root = ref<HTMLElement>()
        const router = useRouter()
        const $style = useCssModule()
        const parsedContent = computed(() => {
            const content = getSlotChildrenText(slots.default?.()) || props.content

            if (typeof content === 'undefined') return

            if (props.parsed) {
                return props.content
            }
            else {
                const options = { renderer }

                if (props.inline) return marked.parseInline(content, options)
                else return marked(content, options)
            }
        })

        function onLinkClick(event: MouseEvent) {
            const link = event.currentTarget as HTMLLinkElement

            if (event.metaKey || event.ctrlKey || event.shiftKey) return

            if (event.defaultPrevented) return

            // target blank
            if (link.target === '_blank') return

            // download link or external
            if (link.hasAttribute('download')) return

            const href = link.getAttribute('href')

            if (!href) return

            // mailto
            if (href.startsWith('mailto:')) return

            // anchor
            if (href.startsWith('#')) return

            // not relative or absolute URL without protocol
            if (!href.startsWith('/') || href.startsWith('//')) return

            event.preventDefault()

            router.push(href)
        }

        onMounted(() => {
            root.value?.querySelectorAll('a').forEach(link => link.addEventListener('click', onLinkClick))
        })

        onBeforeUnmount(() => {
            root.value?.querySelectorAll('a').forEach(link => link.removeEventListener('click', onLinkClick))
        })

        return () =>
            h(props.tag || 'div', {
                ref: root,
                class: [$style.root],
                innerHTML: parsedContent.value,
            })
    },
})
</script>

<style lang="scss" module>
@use 'sass:math';

.root {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        &:not(:first-child) {
            margin-top: 1.5em;
        }

        &:not(:last-child) {
            margin-bottom: 0.5em;
        }
    }

    h1 {
        @include text-h1;
    }

    h2 {
        @include text-h2;
    }

    h3 {
        @include text-h3;
    }

    h4 {
        @include text-h4;
    }

    h5 {
        @include text-h5;
    }

    strong {
        font-weight: bold;
    }

    a {
        text-decoration: underline;
        text-underline-offset: 0.1em;
    }

    blockquote + p {
        margin-top: 1em;
    }

    hr {
        border: 0;
        border-top: 1px solid rgb(0 0 0 / 20%);
        margin: 1em 0;
    }

    & > ul,
    & > ol {
        &:not(:first-child),
        &:not(hr + &) {
            margin-top: 1.8em;
        }
    }

    li {
        position: relative;
        padding: rem(8) 0 rem(8) rem(40);
        border-bottom: 1px solid rgb(0 0 0 / 20%);

        &:last-child {
            border: none;
        }

        &::before {
            position: absolute;
            top: calc(0.5em + #{rem(math.div(8, 2))});
            left: 0;
            width: rem(8);
            height: rem(8);
            border-radius: 50%;
            background-color: currentcolor;
            content: '';
        }

        li {
            padding: rem(2) 0 rem(2) rem(25);
            border: none;

            &::before {
                top: calc(0.5em + #{rem(math.div(6, 2))});
                width: rem(6);
                height: rem(6);
                background-color: currentcolor;
                content: '';
            }
        }
    }

    ol {
        counter-reset: item;
    }

    ol li {
        counter-increment: item;

        &::before {
            top: rem(8);
            width: auto;
            height: auto;
            background-color: transparent;
            content: counters(item, '.') '.';
        }

        li {
            padding-left: rem(40);

            &::before {
                top: rem(2);
            }
        }
    }

    > p + blockquote,
    > p + p,
    > ul + p {
        margin-top: 1.5em;
    }

    img {
        display: block;
        max-width: 100%;
        height: auto;
        margin: rem(15) 0;
    }

    iframe {
        max-width: 100%;
        margin: rem(15) 0;
        aspect-ratio: 16/9;
    }
}
</style>

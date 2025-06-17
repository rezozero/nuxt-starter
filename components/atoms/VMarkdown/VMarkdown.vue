<script lang="ts">
import type { Tokens } from 'marked'
import { marked } from 'marked'
import { getSlotsInnerText } from '~/utils/vue/get-slot-children-text'

const renderer = new marked.Renderer()
const linkRenderer = renderer.link

marked.use({
    renderer: {
        link(linkTokens: Tokens.Link) {
            let html = linkRenderer.call(this.parser.renderer, linkTokens)
            const href = linkTokens.href

            if (href && href.startsWith('http') && !html.includes('target="_blank"')) {
                html = html.replace(/^<a /, '<a target="_blank" ')
            }

            // All downloadable links (with an extension) should open in a new tab
            if (href && href.match(/\.(?!html|php)([a-z0-9]{3,4})$/i) && !html.includes('_blank')) {
                html = html.replace(/^<a /, '<a target="_blank" ')
            }

            return html
        },
    },
})

export default defineComponent({
    props: {
        content: String, // use this prop or directly default slot
        inline: Boolean,
        parsed: Boolean,
        tag: String,
    },
    setup(props, { slots }) {
        const root = ref<HTMLElement>()
        const $style = useCssModule()
        const parsedContent = computed(() => {
            const content = getSlotsInnerText(slots) || props.content

            if (typeof content === 'undefined') return

            if (props.parsed) {
                return content
            }
            else {
                if (props.inline) return marked.parseInline(content)
                else return marked(content)
            }
        })

        useRelativeLinks(root)

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
@use 'assets/scss/mixins/typography' as *;

.root {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        text-wrap: balance;
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

    p {
        text-wrap: pretty;

        @include text-body;
    }

    a {
        color: inherit;
        text-decoration: underline;
        text-underline-offset: 0.1em;
        transition: opacity 0.2s ease(out-quad);

        @media (hover: hover) {
            &:hover {
                opacity: 0.6;
            }
        }
    }

    hr {
        border: 0;
        border-top: 1px solid rgb(0 0 0 / 20%);
        margin: 1em 0;
    }

    li {
        @include text-body;

        margin-block: 3px;

        p {
            margin-block: initial;
        }
    }

    ul {
        padding-left: 2ch;

        // To customize the ::marker, opt for the UTF-8 code.
        // https://www.w3schools.com/charsets/ref_utf_geometric.asp
    }

    ol {
        padding-left: 3ch;
        counter-reset: item;
        list-style-type: decimal-leading-zero;

        li {
            counter-increment: item;
        }
    }

    img {
        display: block;
        max-width: 100%;
        height: auto;
        margin: 15px 0;
    }

    iframe {
        max-width: 100%;
        margin: 15px 0;
        aspect-ratio: 16 / 9;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th,
    td {
        padding: 10px 0;
        border-bottom: 1px solid var(--colors-line-secondary, rgb(0 0 0 / 20%));

        @include text-body;
    }
}
</style>

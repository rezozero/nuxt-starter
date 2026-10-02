<script lang="ts">
import type { Tokens } from 'marked'
import { marked } from 'marked'
import { markedTableExtension } from '~/utils/markdown/marked-table-extension'
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

marked.use({
    extensions: [{
        name: 'mark',
        level: 'inline',
        start(src) { return src.indexOf('==') },
        tokenizer(src) {
            const match = src.match(/^==([^=\n]+)==/)
            if (match) {
                return { type: 'mark', raw: match[0], text: match[1] }
            }
        },
        renderer(token) {
            return `<mark>${token.text}</mark>`
        },
    }],
})

marked.use(markedTableExtension)

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
        text-wrap: var(--v-markdown-heading-text-wrap, balance);
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
        text-wrap: var(--v-markdown-paragraph-text-wrap, pretty);

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
        border-top: 1PX solid var(--colors-line-secondary, rgb(0 0 0 / 20%));
        margin: 1em 0;
    }

    ul {
        padding-left: 2ch;
    }

    ol {
        padding-left: 3ch;
        counter-reset: item;
        list-style-type: decimal-leading-zero;

        li {
            counter-increment: item;
        }
    }

    li {
        @include text-body;

        margin-block: px-to-em(3);
    }

    img {
        display: block;
        max-width: 100%;
        height: auto;
        margin: 1em 0;
    }

    iframe {
        max-width: 100%;
        margin: 1em 0;
        aspect-ratio: 16 / 9;
    }

    // Scroll container rendered by marked-table-extension: the table keeps its semantics on narrow screens
    :global(.v-markdown-table) {
        max-width: 100%;
        overflow-x: auto;
    }

    table {
        width: 100%;
        min-width: max-content;
        border-collapse: collapse;

        @include media('>=md') {
            min-width: 0;
        }
    }

    caption {
        caption-side: top;
        font-weight: 500;
        padding-block-end: 1em;
        text-align: start;

        @include text-body;
    }

    mark {
        padding-bottom: var(--v-markdown-mark-padding-bottom, 0.08lh);
        background-color: var(--v-markdown-mark-background, mark);
        color: var(--v-markdown-mark-color, marktext);
    }

    th,
    td {
        padding: 10px 0;
        border-bottom: 1PX solid var(--colors-line-secondary, rgb(0 0 0 / 20%));

        @include text-body;

        & + :is(th, td) {
            padding-inline-start: 1em;
        }
    }

    th {
        font-weight: 500;
        text-align: start;
    }
}
</style>

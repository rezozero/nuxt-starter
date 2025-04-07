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
@use 'sass:math';
@use 'assets/scss/functions/rem' as *;
@use 'assets/scss/mixins/typography' as *;

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

    & > ul,
    & > ol {
        &:not(:first-child),
        &:not(hr + &) {
            margin-top: 1.8em;
        }
    }

    ol, ul, menu, summary {
        list-style: none;
    }

    ol {
        counter-reset: item;
    }

    li {
        position: relative;
        padding: rem(8) 0 rem(8) rem(40);

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

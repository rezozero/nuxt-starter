<script lang="ts">
import { marked } from 'marked'
import Vue from 'vue'
import type { VNode } from 'vue'

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

export default Vue.extend({
    name: 'VMarkdown',
    props: {
        content: String, // use this prop or directly default slot
        inline: Boolean,
        parsed: Boolean,
        tag: String,
    },
    mounted() {
        this.$el.querySelectorAll('a').forEach((link) => link.addEventListener('click', this.onLinkClick))
    },
    beforeDestroy() {
        this.$el.querySelectorAll('a').forEach((link) => link.removeEventListener('click', this.onLinkClick))
    },
    methods: {
        onLinkClick(event: MouseEvent) {
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

            this.$router.push(href)
        },
    },
    render(createElement): VNode {
        const { inline, tag, parsed } = this.$props
        const content = this.$slots.default?.[0]?.text?.trim() || this.content

        let parsedContent = ''

        if (typeof content !== 'undefined') {
            if (parsed) {
                parsedContent = content
            } else {
                const options = { renderer }

                if (inline) parsedContent = marked.parseInline(content, options)
                else parsedContent = marked(content, options)
            }
        }

        return createElement(tag || 'div', {
            domProps: { innerHTML: parsedContent },
            class: [this.$style.root],
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

    //h1 {
    //    @include text-h1;
    //}
    //
    //h2 {
    //    @include text-h2;
    //}
    //
    //h3 {
    //    @include text-h3;
    //}
    //
    //h4 {
    //    @include text-h4;
    //}
    //
    //h5 {
    //    @include text-h5;
    //}

    strong {
        font-weight: bold;
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

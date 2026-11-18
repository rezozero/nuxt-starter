import type { Value } from 'sass'
import { readdirSync, readFileSync } from 'node:fs'
import { extname, join, sep } from 'node:path'
import { addVitePlugin, defineNuxtModule, useLogger } from 'nuxt/kit'
import { sassFalse, sassTrue } from 'sass'

interface ThemeKeysOptions {
    // Directories whose sources are scanned for theme custom property reads (default: the app directory)
    dirs?: string[]
    // Theme keys always kept, e.g. the ones read by content the sources do not contain (API, CMS, dependencies)
    safelist?: string[]
}

// The prefix the `theme()` mixin gives to the custom properties (`--theme-#{$key}`)
const PROPERTY_PREFIX = 'theme-'
const SCANNED_EXTENSIONS = new Set(['.vue', '.scss', '.css', '.ts', '.js'])
// A theme custom property name, but not a BEM modifier (`root--theme-dark`, `&--theme-dark`, `#{&}--theme-dark`)
const PROPERTY_NAME = new RegExp(`(?<![\\w&}-])--${PROPERTY_PREFIX}([\\w-]+)`, 'g')
// A `var()` whose name is built at compile time (`#{}`) or run time (`${}`)
const DYNAMIC_VAR = /var\(\s*--([\w-]*)(?:#\{|\$\{)/g
// A name built in a script: template literal (`--theme-${key}`) or concatenation ('--theme-' + key)
const DYNAMIC_NAME = /(?<![\w&}-])--([\w-]*)(?:\$\{|['"`]\s*\+)/g

/**
 * Drops the theme keys that no source reads from the CSS custom properties emitted by the `theme()` mixin,
 * in production builds only.
 *
 * A theme exported from Figma declares every key, while the components usually read a fraction of them.
 * The module scans the sources for `--theme-<key>` references and provides the `theme-key-used($key)` Sass function
 * the mixin filters with (see `mixins/_theme.scss`).
 *
 * It never drops a key it is not sure about:
 * - in dev, the function is not provided: every key is kept;
 * - a name built dynamically (`var(--theme-#{$name})`, `--theme-${name}`, `'--theme-' + name`) cannot be scanned:
 *   every key starting with its static part is kept (all of them for `var(--#{$name})`), with a build warning.
 * Keys only read outside the scanned directories (API or CMS content, dependencies) must be listed in `safelist`.
 */
export default defineNuxtModule<ThemeKeysOptions>({
    meta: {
        name: 'theme-keys',
        configKey: 'themeKeys',
    },
    setup(options, nuxt) {
        if (nuxt.options.dev) return

        const { dirs = [nuxt.options.srcDir], safelist = [] } = options

        const logger = useLogger('theme-keys')
        const roots = dirs.map(dir => join(dir, sep))
        const usedKeys = new Set(safelist)
        // Static parts of the dynamically built names: the keys starting with one of them are kept
        const keptPrefixes = new Set<string>()

        for (const root of roots) {
            for (const entry of readdirSync(root, { recursive: true, withFileTypes: true })) {
                const file = join(entry.parentPath, entry.name)

                if (!entry.isFile() || !SCANNED_EXTENSIONS.has(extname(file))) continue

                const source = readFileSync(file, 'utf-8')

                for (const match of source.matchAll(PROPERTY_NAME)) usedKeys.add(match[1]!)

                const dynamicMatches = [...source.matchAll(DYNAMIC_VAR), ...source.matchAll(DYNAMIC_NAME)]

                for (const name of new Set(dynamicMatches.map(match => match[1]!))) {
                    // Cannot be a theme custom property (e.g. `--v-img-${name}`)
                    if (!name.startsWith(PROPERTY_PREFIX) && !PROPERTY_PREFIX.startsWith(name)) continue

                    const prefix = name.slice(PROPERTY_PREFIX.length)

                    keptPrefixes.add(prefix)
                    logger.warn(`${file}: \`--${name}…\` is built dynamically, ${prefix ? `the theme keys starting with "${prefix}"` : 'all the theme keys'} are kept`)
                }
            }
        }

        function isUsed(key: string) {
            return usedKeys.has(key) || [...keptPrefixes].some(prefix => key.startsWith(prefix))
        }

        addVitePlugin({
            name: 'theme-keys',
            config() {
                return {
                    css: {
                        preprocessorOptions: {
                            scss: {
                                functions: {
                                    'theme-key-used($key)': ([key]: Value[]) => {
                                        return isUsed(key!.assertString('key').text) ? sassTrue : sassFalse
                                    },
                                },
                            },
                        },
                    },
                }
            },
        })
    },
})

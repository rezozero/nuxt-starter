import type { Value } from 'sass'
import { readdirSync, readFileSync } from 'node:fs'
import { extname, join, sep } from 'node:path'
import { addVitePlugin, defineNuxtModule } from 'nuxt/kit'
import { sassFalse, sassTrue } from 'sass'

type Level = 'error' | 'warn' | 'off'
// A single value for both modes, or one per mode (dev: `nuxi dev` and stories, build: `nuxi build` and `nuxi generate`)
type PerMode<T> = T | { dev?: T, build?: T }

interface ThemeKeysOptions {
    // The `$themes` map exported from Figma (variables2css), required
    themesFile?: string
    // Directories whose sources are scanned for custom property references (default: the app directory)
    dirs?: string[]
    // Theme keys always kept, e.g. the ones read by content the sources do not contain (API, CMS, dependencies)
    safelist?: string[]
    // Whether the theme keys no source reads are dropped. When disabled, every key is kept (default: true)
    enabled?: PerMode<boolean>
    // What a dynamically built name triggers, its keys being dropped unless safelisted
    // (default: warn in dev, error in build)
    dynamicNames?: PerMode<Level>
}

const SCANNED_EXTENSIONS = new Set(['.vue', '.scss', '.css', '.ts', '.js'])
// A custom property name, but not a BEM modifier (`root--size`, `&--size`, `#{&}--size`)
const PROPERTY_NAME = /(?<![\w&}-])--([\w-]+)/g
// A `var()` whose name is built at compile time (`#{}`) or run time (`${}`)
const DYNAMIC_VAR = /var\(\s*--([\w-]*)(?:#\{|\$\{)/g
// A name built in a script: template literal (`--color-${key}`) or concatenation ('--color-' + key)
const DYNAMIC_NAME = /(?<![\w&}-])--([\w-]*)(?:\$\{|['"`]\s*\+)/g
// A key of the themes map, not a nested map (`light: (`)
const THEME_KEY = /^\s+([\w-]+):\s*[^\s(]/gm
// Same as Vite's `isCSSRequest()`, which this package cannot import (vite is not a direct dependency)
const CSS_REQUEST = /\.(?:css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/

function resolveMode<T extends boolean | string>(option: PerMode<T> | undefined, dev: boolean, fallback: T): T {
    if (typeof option === 'object') return option[dev ? 'dev' : 'build'] ?? fallback

    return option ?? fallback
}

/**
 * Drops the theme keys that no source reads from the CSS custom properties emitted by the `theme()` mixin,
 * in dev as in build, so that both emit the same custom properties: a key no source reads (a typo, a name only
 * read from CMS content) is noticed during development, not after the first production build.
 *
 * A theme exported from Figma declares every key, while the components usually read a fraction of them.
 * The module scans the sources for `--key` references and provides the `theme-key-used($key)` Sass function
 * the mixin filters with (see `mixins/_theme.scss`). In dev, the scan is computed again when a source changes.
 *
 * A name built dynamically (`var(--color-#{$name})`, `--color-${name}`, `'--color-' + name`) cannot be scanned,
 * and keeping every key starting with its static part would quietly cancel the pruning. Its keys are dropped, and
 * `dynamicNames` sets how it is reported: write the names out (which keeps them greppable) or list them in `safelist`.
 *
 * Keys only read outside the scanned directories (API or CMS content, dependencies) must be listed in `safelist`.
 * When `enabled` is false for a mode, the function is not provided and every key is kept.
 */
export default defineNuxtModule<ThemeKeysOptions>({
    meta: {
        name: 'theme-keys',
        configKey: 'themeKeys',
    },
    setup(options, nuxt) {
        const dev = nuxt.options.dev

        if (!resolveMode(options.enabled, dev, true)) return

        const { themesFile, dirs = [nuxt.options.srcDir], safelist = [] } = options

        if (!themesFile) throw new Error('[theme-keys] The `themesFile` option is required')

        const level = resolveMode<Level>(options.dynamicNames, dev, dev ? 'warn' : 'error')
        const roots = dirs.map(dir => join(dir, sep))
        const safelistedKeys = new Set(safelist)
        const referencesByFile = new Map<string, Set<string>>()
        const dynamicNamesByFile = new Map<string, string[]>()
        const reloadCallbacks: (() => void)[] = []
        let themeKeys: string[] = []
        let usedKeys = new Set<string>()

        function isScanned(file: string) {
            return SCANNED_EXTENSIONS.has(extname(file)) && roots.some(root => file.startsWith(root))
        }

        function readThemeKeys(file: string) {
            const source = readFileSync(file, 'utf-8')

            themeKeys = [...new Set(Array.from(source.matchAll(THEME_KEY), match => match[1]!))]
        }

        function scanFile(file: string) {
            const source = readFileSync(file, 'utf-8')
            const dynamicMatches = [...source.matchAll(DYNAMIC_VAR), ...source.matchAll(DYNAMIC_NAME)]

            referencesByFile.set(file, new Set(Array.from(source.matchAll(PROPERTY_NAME), match => match[1]!)))
            dynamicNamesByFile.set(file, [...new Set(dynamicMatches.map(match => match[1]!))])
        }

        function getUsedKeys() {
            const references = new Set<string>()

            referencesByFile.forEach(names => names.forEach(name => references.add(name)))

            return new Set(themeKeys.filter(key => safelistedKeys.has(key) || references.has(key)))
        }

        // A name is reported when it may read a theme key that is not safelisted.
        // An empty prefix (`var(--#{$token})`) is left out: it is how the spacing and radius tokens are read.
        function getDynamicNameMessages(files = [...dynamicNamesByFile.keys()]) {
            return files.flatMap((file) => {
                return (dynamicNamesByFile.get(file) ?? [])
                    .filter((prefix) => {
                        return prefix && themeKeys.some((key) => {
                            return !safelistedKeys.has(key) && key.startsWith(prefix)
                        })
                    })
                    .map((prefix) => {
                        return `${file}: \`--${prefix}…\` is built dynamically, so its theme keys are dropped. `
                            + 'Write the names out or list them in `safelist`'
                    })
            })
        }

        readThemeKeys(themesFile)

        for (const root of roots) {
            for (const entry of readdirSync(root, { recursive: true, withFileTypes: true })) {
                const file = join(entry.parentPath, entry.name)

                if (entry.isFile() && isScanned(file)) scanFile(file)
            }
        }

        usedKeys = getUsedKeys()

        addVitePlugin({
            name: 'theme-keys',
            config() {
                return {
                    css: {
                        preprocessorOptions: {
                            scss: {
                                functions: {
                                    'theme-key-used($key)': ([key]: Value[]) => {
                                        return usedKeys.has(key!.assertString('key').text) ? sassTrue : sassFalse
                                    },
                                },
                            },
                        },
                    },
                }
            },
            // Vite does not know the compiled styles depend on the used keys: every style is compiled again
            configureServer(server) {
                reloadCallbacks.push(() => {
                    for (const { moduleGraph } of Object.values(server.environments)) {
                        for (const module of moduleGraph.idToModuleMap.values()) {
                            if (module.id && CSS_REQUEST.test(module.id)) moduleGraph.invalidateModule(module)
                        }
                    }

                    server.ws.send({ type: 'full-reload' })
                })
            },
            buildStart() {
                const messages = getDynamicNameMessages()

                if (level === 'off' || !messages.length) return

                if (level === 'error') this.error(messages.join('\n'))
                else messages.forEach(message => this.warn(message))
            },
            watchChange(id, { event }) {
                if (id === themesFile) readThemeKeys(id)
                else if (!isScanned(id)) return
                else if (event === 'delete') {
                    referencesByFile.delete(id)
                    dynamicNamesByFile.delete(id)
                }
                else {
                    scanFile(id)

                    // Only a warning: an error would stop the watcher, and the next build fails anyway
                    if (level !== 'off') getDynamicNameMessages([id]).forEach(message => this.warn(message))
                }

                const nextUsedKeys = getUsedKeys()

                if (nextUsedKeys.size === usedKeys.size && [...nextUsedKeys].every(key => usedKeys.has(key))) return

                usedKeys = nextUsedKeys
                reloadCallbacks.forEach(reload => reload())
            },
        })
    },
})

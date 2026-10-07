# Frontend Guidelines

Frontend code rules for this project. For project overview, stack, and workflow, see [`README.md`](../README.md).

---

## 0. Principles

These principles guide every decision below.

- **Native first.** Prefer what the browser already does (e.g. `<dialog>`, the Popover API, native form validation, modern CSS) over custom JS. Less code to ship and maintain, and behaviour improves as browser support grows (progressive enhancement). When support is still partial, a simple fallback is enough.
- **Mobile first.** Base styles target small screens; breakpoints add on top (`@include media('>=md')`), they don't undo.
- **Style in CSS, not JS.** Never compute styles from client-side measurements (`window`, element width, inline styles). The SSR render would differ from the client one and cause layout shift (CLS). Drive states with classes, attributes and CSS custom properties.
- **Minimal DOM.** No wrapper or nesting without a semantic or layout reason (see §1).
- **Inferred types.** Let TypeScript infer types (`ref(0)`, `computed`, return values). Annotate only what acts as a contract: props, emits, public function signatures, empty refs.

```ts
// ❌ Redundant annotations
const count: Ref<number> = ref<number>(0)
const label = computed<string>(() => `${count.value} items`)

// ✅ Inferred
const count = ref(0)
const label = computed(() => `${count.value} items`)

// ✅ Annotated where inference can't help
const element = ref<HTMLElement | null>(null)
```

---

## 1. DOM Structure — less is more

**Main rule: every element must have a reason to exist.**

```html
<!-- ❌ Unnecessary wrappers -->
<div class="wrapper">
  <div class="inner">
    <div class="content">
      <p>Text</p>
    </div>
  </div>
</div>

<!-- ✅ Direct and semantic -->
<p>Text</p>
```

- Ideally **2–3 levels of nesting** per component in common cases
- Use the most specific HTML element; `<div>` / `<span>` only when no semantic element fits
- One component = one root element (`<component :is="tag">` or a single semantic tag), no unnecessary phantom `<div>`
- Use `<template>` for conditions/loops that need grouping without an extra DOM node

---

## 2. Component naming

- **`V` prefix** is mandatory: `VButton`, `VCard`, `VModal`, `VCarousel`
- **PascalCase** for filenames: `VFieldWrapper.vue`, `VRoadizImage.vue`
- CMS blocks (in `app/blocks/`) are registered globally — their filename must match the CMS block type name (e.g. `ContentBlock` in Roadiz → `ContentBlock.vue`)

---

## 3. CSS Modules — naming convention

All components use `<style lang="scss" module>`. Classes are referenced via `$style`.

### Classes

The naming follows a BEM-like approach: a root class, semantic children, and modifiers suffixed on root.

| Usage | Convention | Example |
|-------|-----------|---------|
| Component root | `.root` | `$style.root` |
| Semantic child | short descriptive name | `.title`, `.label`, `.icon`, `.content` |
| State modifier | `root--<state>` | `.root--open`, `.root--disabled` |
| Prop modifier | `root--<prop>-<value>` | `.root--size-md`, `.root--icon-last` |
| Theme modifier | handled via `theme-variants` mixin | see `app/assets/scss/mixins/_theme.scss` |

```vue
<template>
  <div :class="[$style.root, isOpen && $style['root--open']]">
    <h2 :class="$style.title">…</h2>
    <div :class="$style.content">…</div>
  </div>
</template>

<style lang="scss" module>
.root {
    …

    &--open { … }       // generates .root--open
    &--disabled { … }   // generates .root--disabled
    &--size-md { … }    // generates .root--size-md
}

.title { … }
.content { … }
</style>
```

> Modifiers are always nested under `.root` via `&--`. Never declare them flat at the file level.

### No global classes inside a component

`<style module>` blocks are scoped by definition. Never use `:global()` unless absolutely necessary (e.g. resetting a third-party library).

### CSS Custom Properties for customisation

Components expose their styles via **CSS custom properties** with fallbacks — never hardcode values that would block customisation:

```scss
// Inside VButton component
.root {
    display: var(--v-button-display, inline-flex);
    padding: var(--v-button-padding, initial);
    background-color: var(--v-button-background-color, initial);
    color: var(--v-button-color, inherit);
}
```

The naming pattern is: `--v-<component>-<property>`.

### Overriding a component — prefer CSS vars to avoid layout shift

When applying an external class on a component that already exposes CSS custom properties, **always use those variables rather than redeclaring the property directly**. Redeclaring the property creates a specificity conflict and can cause a layout shift during SSR rendering (the component's value is applied, then overridden client-side).

```scss
// ❌ Risk of layout shift — display is declared twice
.my-button {
    display: flex;
}

// ✅ No conflict — we drive the value via the variable VButton already exposes
.my-button {
    --v-button-display: flex;
}
```

Before overriding a component's CSS property, check its `<style>` block to see which custom properties it exposes.

---

## 4. SCSS — usage rules

- Global variables live in `app/assets/scss/variables/` — do not redefine locally
- `_resources.scss` is injected in every component: it must never output CSS (only variables, functions, mixins)
- No hex colors in components — use the `color()` function
- Mobile first: nest media queries inside the rule with named breakpoints (`@include media('>=md')`), never raw pixel values
- No `vw` units and no half pixels; write `px`, they are converted to `rem` by `postcss-pxtorem`
- Avoid nested descendant selectors — prefer flat declarations:

```scss
// ❌ Avoid
.header {
    .logo { … }
}

// ✅ Prefer
.header { … }
.logo { … }
```
- Use `:where()` for overrides without increasing specificity:

```scss
// ✅ User-agent reset without added specificity
:where(button#{&}) {
    text-align: inherit;
    color: inherit;
}
```

- Use existing mixins (`theme-variants`, `sizes`) rather than duplicating logic
- Prefer `flex` and `grid` for layouts — no `float`, no `position: absolute` unless necessary

---

## 5. Accessibility — non-negotiable

Accessibility is a requirement, not a bonus: RGAA compliance is required at delivery. When sources disagree, follow this order: **RGAA > WCAG > ARIA > APG / DSFR**. Agency RGAA referents: Timothé and Manuel.

Before each PR/MR, check: contrast, visible focus, keyboard navigation, status messages, 200% zoom, 320px width. Tools: axe, WAVE, Ara.

### Semantics and ARIA

- Native semantics first: use the most specific element (see §1) and add ARIA only when no native element or attribute can express the role, state or relation (first rule of ARIA).
- An action is a `<button>`, never a `<div @click>`; a modal is a native `<dialog>`.
- Every interactive state the user perceives visually must be exposed to assistive technologies (expanded, selected, current, invalid…).
- Decorative content is hidden from the accessibility tree (`aria-hidden="true"`, `alt=""`).

```vue
<!-- ✅ Accessible button with state -->
<button
    :aria-expanded="isOpen"
    :aria-controls="panelId"
>
    {{ label }}
</button>
```

### Focus

- Always style `:focus-visible` — never remove `outline` without an alternative:

```scss
&:focus-visible {
    outline: 2px solid var(--theme-color-content-primary, currentColor);
    outline-offset: 6px;
}
```

- Manage focus return after closing a modal or popover
- Use the `.visually-hidden` utility class (already available) for content intended for screen readers only

### Reduced motion

Respect `prefers-reduced-motion` for all animations:

```ts
import { usePreferredReducedMotion } from '@vueuse/core'
const reducedMotion = usePreferredReducedMotion()
// if reducedMotion.value === 'reduce', disable or reduce animations
```

### Forms

- Every `<input>` must have an associated `<label>` via `for`/`id`
- Error messages must be linked to the input via `aria-describedby`

---

## 6. Vue components — code conventions

### TypeScript

- Type `defineProps` / `defineEmits`, use `defineModel` for `v-model`
- No `any`; `import type` for type-only imports
- Derived values go in `computed`, types are inferred (see §0)

### Dynamic classes

For complex class bindings, prefer `computed` — it keeps the template readable and the logic testable. Simple inline expressions in the template are fine:

```ts
const rootClasses = computed(() => [
    $style.root,
    props.disabled && $style['root--disabled'],
    props.size && $style[`root--size-${props.size}`],
])
```

---

## 7. Images

- Define `sizes` for responsive images — this tells the browser which rendered width to expect at each breakpoint:

```vue
    <VImg
        v-bind="imageProps"
        sizes="xs:100vw md:100vw"
    />
    <VRoadizImage
        :document="mainDocument"
        alt=""
    >
        <VPictureSource
            sizes="xs:100vw md:100vw lg:100vw"
        />
        <VPictureSource
            sizes="lg:80vw vl:80vw xl:80vw xxl:80vw qhd:80vw"
            media="(max-width: 1024px)"
        />
    </VRoadizImage>
```

- Use `fetchpriority="high"` (via the `preload` prop) only for the above-the-fold image (LCP)
- Never omit the `alt` attribute — empty (`alt=""`) for decorative images, descriptive otherwise

---

## 8. Internationalisation

- Translation keys follow a hierarchy: `component.element` (e.g. `card.link_label`, `form.error`)
- Never hardcode strings in a template

---

## 9. Performance

- **Lazy-load** heavy components: prefix with `Lazy` (`<LazyVModal>`)
- **Dynamic imports** for heavy third-party libraries (e.g. Swiper imported on demand)

---

## 10. GDPR

GDPR compliance is required at delivery.

- No third-party resource loaded by the browser without consent: fonts are self-hosted, embeds (video, maps, social) are loaded after consent
- Audience measurement (Matomo, GTM) runs only after consent
- Any new third-party service must be added to the project's processing and subcontractor registers

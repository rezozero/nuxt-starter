# Frontend Guidelines

Frontend code rules for this project. For project overview, stack, and workflow, see [`README.md`](../README.md).

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
- Prefer HTML5 semantic elements (`<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>`, `<figure>`, `<dialog>`, `<fieldset>`) over generic `<div>`
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

Accessibility is a requirement, not a bonus.

### Semantic elements

Always use the most precise HTML element:

| Need | Element |
|------|---------|
| Navigation | `<nav aria-label="…">` |
| Dialog / modal | native `<dialog>` |
| Grouped form fields | `<fieldset>` + `<legend>` |
| Image with caption | `<figure>` + `<figcaption>` |
| External link | `<a target="_blank" rel="noopener noreferrer">` |
| Action without navigation | `<button>` (never `<div @click>`) |

### ARIA

- `aria-label`: when visible text is insufficient (e.g. icon-only buttons)
- `aria-expanded`: for any toggle state (accordion, menu, popover)
- `aria-controls`: link a button to the element it controls
- `aria-describedby`: link a field to its error or help message
- `aria-live="polite"`: for dynamic announcements (progress, messages)
- `aria-hidden="true"`: hide purely decorative elements from the accessibility tree

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

### Dynamic classes

For complex class bindings, prefer `computed` — it keeps the template readable and the logic testable. Simple inline expressions in the template are fine:

```ts
const rootClasses = computed(() => [
    $style.root,
    props.disabled && $style['root--disabled'],
    props.size && $style[`root--size-${props.size}`],
])
```

### Dynamic component

Use `<component :is="tag">` when the root element varies semantically (e.g. `<button>` for an action, `<a>` for navigation):

```vue
<component :is="internalTag" v-bind="attrs">…</component>
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

# Markdown tables

Tables written in Roadiz markdown fields are rendered by `VMarkdown` through `app/utils/markdown/marked-table-extension.ts`.

```md
Tableau : Tarifs des visites

| Prestation | Durée | Tarif |
| :--- | :--- | :--- |
| **Visite guidée** | 1 h 30 | 12 € par personne |
| **Atelier enfant** | 45 min | 5 € par enfant |
```

- **Caption**: a single-line paragraph starting with `Tableau :`, right before the table (blank line in between), becomes the `<caption>`. Placed after the table it would be parsed as an extra row. Write `Tableau masqué :` to keep the caption for screen readers only (`.visually-hidden`), e.g. when a title right above already describes the table.
- **Column headers**: header row cells render as `<th scope="col">`; bold in them is redundant and dropped.
- **Row headers**: a first cell fully in bold renders as `<th scope="row">`.
- **Alignment**: `:---` left, `:---:` centered, `---:` right, rendered as an inline `text-align` on each cell.
- **Responsive**: the table sits in a horizontal scroll container (`.v-markdown-table`) with `tabindex="0"`, so it can be scrolled with the keyboard in Safari (Chrome and Firefox make scroll containers focusable natively). No `role`/`aria-label`: the `<caption>` already names the table, a region label would announce it twice.

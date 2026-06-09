# Nuxt Starter — AI Context

Nuxt 4 / Vue 3 starter connected to a Roadiz CMS. SSR, CSS Modules, pnpm, ESLint (no Prettier).

Read [`docs/GUIDELINES.md`](./docs/GUIDELINES.md) before starting any integration task and strictly follow its rules throughout.

---

## Documentation

When making a structural change (new module, renamed convention, new env variable, changed workflow), update the relevant file in `docs/` before closing the task.

---

## Do

- Follow existing conventions and repo structure before introducing anything new.
- Limit edits to files involved in the task.
- Use existing tokens, mixins, and variables — check `app/assets/scss/` before creating new ones.
- Explain changes and the reason behind them.

## Don't

- Modify or commit secrets (`.env`, credentials).
- Introduce global reformatting unrelated to the task.
- Add new conventions without justification.
- Use `display: none` / `visibility: hidden` on interactive or form elements.

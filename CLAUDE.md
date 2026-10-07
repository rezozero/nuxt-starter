@AGENTS.md

## Claude Code

- Shared permissions live in `.claude/settings.json`; keep personal settings and tokens in `.claude/settings.local.json` (git-ignored), never in a committed file.
- **Figma MCP**: from the node URL given by the developer, use `get_design_context` and `get_screenshot`, then map values to existing tokens and `V*` components (see `docs/GUIDELINES.md`) — never paste raw values.
- **GitLab MCP** (client projects): read the linked issue before coding.

# Agentic Testing with Cypress Tap

Your Cypress project for the [Agentic Testing with Cypress Tap](https://talkingabouttesting.school/courses/agentic-testing-with-cypress-tap) course at the [Talking About Testing School](https://talkingabouttesting.school), pointed at **Emoji Mart**, an online store that sells emojis, deployed at <https://emoji-mart-one.vercel.app/>.

> ⚠️ **There are no tests yet. You will write them.** There is no `package.json` yet either: the first lesson creates it and installs Cypress. The app is deployed and kept as it is for the course, so there is nothing to fix here by pull request.

## Requirements

- [git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) 22 or newer, and npm, which comes with it
- A code editor
- An AI coding agent (the course shows [Claude Code](https://docs.claude.com/en/docs/claude-code/overview))
- A Chromium-based browser (Chrome recommended)

No Docker is needed.

## The specification

[`docs/requirements.md`](./docs/requirements.md) says what Emoji Mart **should** do. Tests assert the requirements, not what the app happens to do, and a bug report quotes the requirement it breaks.

## The project rules

[`docs/cypress/`](./docs/cypress/cypress.md) holds the project's rules for writing Cypress tests, starting with `docs/cypress/cypress.md`. The project skill lives in [`.claude/skills/emoji-mart-testing/`](./.claude/skills/emoji-mart-testing/SKILL.md), and the instructions for any AI agent in [`AGENTS.md`](./AGENTS.md) (which `CLAUDE.md` imports).

## License

[MIT](./LICENSE)

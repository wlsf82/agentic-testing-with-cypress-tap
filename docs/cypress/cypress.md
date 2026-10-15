# Cypress Testing Instructions

This documentation provides the rules for writing Cypress tests in this project. The instructions are organized into focused topic areas for easy navigation and reference.

> **Quick Reference:** For a concise summary of the rules specific to this project, see the [emoji-mart-testing skill](../../.claude/skills/emoji-mart-testing/SKILL.md).

## Why these rules exist

The official Cypress skills know Cypress. These rules know this project: a deployed app with no source code to read, only four `data-testid` attributes, buttons with no accessible name, every view on one URL, and a team that records a known bug in a specific way. Where the two disagree, these rules win.

The failure catalog in `07-cypress-tap.md` grows from failures that actually happened here.

## Documentation Structure

The guidelines are organized into the following topic areas:

### 📁 [01. Project Structure](./01-project-structure.md)

Where do specs go, and how is Cypress configured? Covers the folder structure, `baseUrl`, no fixtures, one spec per feature, and the npm scripts.

### 🧪 [02. Test Organization](./02-test-organization.md)

How is a spec organized? Covers `describe` and `context`, the `beforeEach` hook (and why not `before`, `after`, or `afterEach`), `testIsolation`, and the AAA (Arrange, Act, Assert) pattern.

### 🎯 [03. Selectors](./03-selectors.md)

Which selector do I use, in which order, and what do I do when the app offers none? Covers the priority order (`data-testid` > `aria-label` > descriptive attributes > `id`), `cy.contains`, aliases, and a button with no name and no test id.

### ⚡ [04. Commands](./04-commands.md)

Which commands are allowed, and how do I wait for a state without `cy.wait(Number)`? Covers retry-ability, working with `.last()` safely, custom commands, and `cy.reload()`.

### ✅ [05. Assertions](./05-assertions.md)

How do I write assertions? Covers asserting the requirement, visible over exist, positive before negative, money as text, values that change on every run, and testing form validation without testing the browser.

### 🎨 [06. Code Quality](./06-code-quality.md)

How should the code look? Covers no conditional testing, test data that looks fake, indentation, npm scripts, and no `.only` in a commit.

### 🔎 [07. Writing Tests with Cypress Tap](./07-cypress-tap.md)

How does the agent use Tap? Covers the six steps, fresh verdicts, reading results, `pin`, `.only` while fixing, confirming a bug before skipping its test, and a failure catalog.

## Navigation Tips

- **For quick rules:** Start with the [project skill](../../.claude/skills/emoji-mart-testing/SKILL.md)
- **For specific topics:** Jump directly to the relevant topic file above
- **For comprehensive learning:** Read through topics 01-07 in order
- **Each topic file** includes a "See Also" section pointing at related topics

## Contributing

When updating these instructions:

- Keep the project skill concise, with the rules specific to this project only
- Place detailed examples and explanations in the appropriate topic file
- Add a rule only from a failure that actually happened, or a mistake that was actually made
- Maintain cross-references between related topics
- Follow the established formatting and example patterns

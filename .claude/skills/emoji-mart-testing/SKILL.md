---
name: emoji-mart-testing
description: "Project rules for this repository's Cypress suite against Emoji Mart, a deployed app with no source code available. Use together with the official Cypress skills whenever you explore Emoji Mart, write, run, review, or fix a spec in cypress/e2e/, choose a selector for it, or triage, confirm, or report one of its bugs. Points to docs/cypress/ (the rules) and docs/requirements.md (what the app should do)."
---

# Emoji Mart testing

This project tests a deployed web app as a black box. These rules add what the official Cypress skills cannot know about it.

## Before anything else

- Read `docs/cypress/cypress.md` and the guide for your task:
  - Setting up or configuring → `01-project-structure.md`
  - Structuring a spec → `02-test-organization.md`
  - Choosing a selector, including for a button with no name → `03-selectors.md`
  - Waiting for a state, custom commands → `04-commands.md`
  - Writing assertions → `05-assertions.md`
  - Code style and test data → `06-code-quality.md`
  - Running, reading, or debugging anything through Cypress Tap → `07-cypress-tap.md`
- `docs/requirements.md` is the reference for what the app should do. Do not read it while exploring the app, unless asked.

## Rules that are specific to this project

- **Browser only.** Learn the app through Cypress Tap (`aria`, `dom`, `inspect`, `reporter`, `command`, `pin`). Never search for, read, or rely on the app's source code, here or on the web.
- **Assert the requirement**, not what the app happens to do. Never change an assertion that states a requirement to make a test pass, and never delete such a test.
- **A fresh verdict or none.** Note `startedAt` before every run; accept only `passed` or `failed` with a different `startedAt`, and a pass only when `results.passed` is greater than zero.
- **No source to check against.** Every selector and text you use, in a spec or a custom command, must appear in `aria` or `dom` output you read on that state.
- **Every view is at `/`, and a reload resets the app.** Reach each state through the UI, from `cy.visit('/')`.
- **No network.** The app makes no requests after it loads: no `cy.intercept`, no `cy.request`, no fixtures.
- **A known bug's test is skipped, not deleted:** confirmed with `.only` and `reporter --test-id` to fail on the assertion that states the requirement, then `it.skip` with a comment naming the bug and its `bug-reports/` file.

## Example

```js
describe('Cart', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('counts units in the cart icon', () => {
    cy.contains('[data-testid="emoji-card"]', 'Rocket').within(() => {
      cy.contains('button', 'Add to Cart').click()
      cy.contains('button', 'Add to Cart').click()
    })

    // assert the badge, on the selector chosen per 03-selectors.md
  })
})
```

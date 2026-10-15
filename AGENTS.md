# Agent instructions

This repository is a Cypress test project for Emoji Mart, a web app deployed at the `baseUrl` in `cypress.config.js` (https://emoji-mart-one.vercel.app). There is no application code here, and you must not look for any.

- **Work from the browser only.** Everything you know about the app comes from Cypress Tap (`npx cypress tap aria`, `dom`, `inspect`, `reporter`, `command`, `pin`) against the running `cypress open` session. Never search for, read, or rely on the app's source code, on this machine or on the web.
- **Follow the project rules** in `docs/cypress/`, starting with `docs/cypress/cypress.md`. They win over general advice, including the official Cypress skills, where they disagree.
- **`docs/requirements.md` says what the app should do.** Tests assert the requirements, never what the app happens to do. Do not read it while exploring the app, unless asked.
- **Never claim a verdict you did not read fresh** (see `docs/cypress/07-cypress-tap.md`), and never change an assertion that states a requirement to make a test pass.
- Do not touch the Cypress window while you drive it, and do not commit unless asked.

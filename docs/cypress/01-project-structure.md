# Cypress Project Structure

> **Part of:** [Cypress Instructions](./cypress.md)

This guide covers the project structure, configuration, and file organization of this Cypress project.

## Files and Folders Structure

Use the default Cypress files and folders structure, with one spec per feature of the app. Emoji Mart has four areas (the catalog, search, the cart, and checkout), so specs sit flat in `cypress/e2e/`, one per area, rather than in folders.

```bash
cypress/
  ├── e2e/                         # End-to-end test specs, one per feature
  │   ├── catalog.cy.js            # The store and an emoji's page
  │   ├── search.cy.js             # The search box
  │   ├── cart.cy.js               # The cart
  │   └── checkout.cy.js           # Checkout and the thank-you page
  └── support/                     # Support code
      ├── commands.js              # Custom Cypress commands
      └── e2e.js                   # Global setup for e2e tests
bug-reports/                       # Bug reports the team writes (not a Cypress folder)
exploration/                       # Notes on the app: feature map, test plan, findings (not a Cypress folder)
cypress.config.js                  # Cypress configuration file
```

> `exploration/` and `bug-reports/` are not Cypress folders. They hold notes and reports written by the team (and its agent), and they are committed like any other file.

## Configuration Settings

The configuration file is `cypress.config.js`:

```js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://emoji-mart-one.vercel.app',
    fixturesFolder: false,
  },
})
```

### `baseUrl`

Always define the `baseUrl` in the `cypress.config.js` file, so a spec calls `cy.visit('/')` instead of repeating the URL, and so tests can run against a different environment by overwriting it with a command line argument.

For example:

```bash
cypress run --config baseUrl=https://staging.example.com
```

### Disabling Unused Folders

The project does not use fixtures, so they are turned off in `cypress.config.js` with `fixturesFolder: false`, and the `cypress/fixtures/` folder is deleted.

## No Fixtures

The app makes no network requests after it loads, so there is nothing to stub. Test data lives inline in the spec that uses it.

## npm Scripts

The project has two scripts, and both use Chrome, because Cypress Tap only works in Chromium-based browsers:

```json
"scripts": {
  "cy:open": "cypress open --e2e --browser chrome",
  "test": "cypress run --browser chrome"
}
```

- `npm run cy:open` opens the session Cypress Tap attaches to
- `npm test` runs every spec headlessly, as CI does

> Scripts call `cypress` without `npx`. See [Code Quality](./06-code-quality.md).

## See Also

- [Test Organization](./02-test-organization.md) - How to structure test files
- [Code Quality](./06-code-quality.md) - npm scripts and test data
- [Writing Tests with Cypress Tap](./07-cypress-tap.md) - The session the scripts open

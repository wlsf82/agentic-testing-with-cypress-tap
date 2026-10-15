# Cypress Code Quality and Standards

> **Part of:** [Cypress Instructions](./cypress.md)

This guide covers code quality standards, test data, and formatting conventions for Cypress test code.

## Test Data

Test data must look fake to anyone who reads the test, the Command Log, or a screenshot: `shopper@example.com`, `Test Shopper`, `123 Test Street`, and the card number in the field's own placeholder, `1234 5678 9012 3456`. Never type real personal or card data.

## Conditional Testing

It's not allowed to use conditions in testing code.

This isn't allowed: 👎

```js
// This only works if there's 100% guarantee
// body has fully rendered without any pending changes
// to its state
cy.get('body').then(($body) => {
  // synchronously ask for the body's text
  // and do something based on whether it includes
  // another string
  if ($body.text().includes('some string')) {
    // yup found it
    cy.get(...).should(...)
  } else {
    // nope not here
    cy.get(...).should(...)
  }
})
```

> **Tests must be deterministic.
> Each run should produce the same behavior and results.
> If multiple paths exist, write a separate test for each.**

## Imports

The specs import nothing. If a spec ever imports, import external packages first, then internal ones, separated by an empty line, each group in alphabetical order.

## Indentation

Use two spaces of indentation.

This helps with breaking lines when chaining Cypress commands.

For example:

```js
cy.contains('[data-testid="emoji-card"]', 'Rocket')
  .should('be.visible')
  .and('contain', '$6.99')
```

> If four spaces were used, the chained commands would not align with the `cy` object.

## npm Scripts

There's no need to add `npx` inside the npm scripts.

npm already knows where to find the binaries when calling scripts defined inside the `package.json` file, so, `npx` is not needed.

**Good example** 👍

```json
"scripts": {
  "cy:open": "cypress open --e2e --browser chrome",
  "test": "cypress run --browser chrome"
}
```

**Bad example** 👎

```json
"scripts": {
  "cy:open": "npx cypress open --e2e --browser chrome",
  "test": "npx cypress run --browser chrome"
}
```

## No `.only` in a Commit

`.only` is for fixing one test at a time (see [Writing Tests with Cypress Tap](./07-cypress-tap.md)). It never reaches a commit. Before committing, this must print nothing:

```bash
grep -rn "\.only" cypress/e2e
```

## See Also

- [Project Structure](./01-project-structure.md) - The npm scripts and the configuration
- [Commands](./04-commands.md) - Writing deterministic tests
- [Writing Tests with Cypress Tap](./07-cypress-tap.md) - `.only` while fixing a test

# Cypress Test Organization

> **Part of:** [Cypress Instructions](./cypress.md)

This guide covers best practices for organizing test files, using hooks effectively, and structuring test cases with the AAA pattern.

## Hooks

To avoid repetitive steps inside `cypress/e2e/*.cy.js` files, use the `beforeEach` hook.

Below is an example.

```js
// cypress/e2e/catalog.cy.js

describe('Catalog', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('shows six emojis', () => {
    // The store is already open, continue doing whatever this test should do.
  })

  it('opens the Rocket', () => {
    // The store is already open, continue doing whatever this test should do.
  })
})
```

### `before`, `after`, and `afterEach`

- Avoid the `before` hook to ensure tests inside the same file can be run independently.
- Do not use the `after` and `afterEach` hooks to avoid leaving trash behind in case Cypress crashes and never runs such hooks. Instead, we clean up first using the `beforeEach` hook.

## `testIsolation`

It's strictly forbidden to define `testIsolation: false` in the `cypress.config.js` file.

> This ensures every test case is written with test independence in mind.

## No URL to Jump To

Every view of Emoji Mart is at `/`: the store, an emoji's page, checkout, and the thank-you page. There is no URL to visit to land on checkout, and a reload resets the app.

A test that needs checkout visits `/` and gets there through the UI, through custom commands (see [Commands](./04-commands.md)).

## Using `context` for Sub-features

When writing tests for a feature that has sub-features, divide them using the `context` function.

**Good example** 👍

```js
describe('Catalog', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  context('Search', () => {
    // Search tests here
  })

  context('Detail view', () => {
    beforeEach(() => {
      cy.contains('[data-testid="emoji-card"]', 'Rocket').click()
    })

    // Detail view tests here
  })
})
```

> `context` functions can have their own `beforeEach` hook if needed.

**Good example - 2** 👍

```js
describe('Main Feature', () => {
  beforeEach(() => {
    // Common steps shared between `context`s
  })

  context('Sub-feature', () => {
    beforeEach(() => {
      // Common steps of a specific `context`
    })

    // Sub-feature tests here
  })

  context('Sub-feature-2', () => {
    beforeEach(() => {
      // Common steps of another specific `context`
    })

    // Sub-feature-2 tests here
  })
})
```

> If many `context`s have common setup steps, they can share a `beforeEach` in an upper `context` or in the main `describe` function.

**Bad example** 👎

```js
describe('Catalog', () => {
  // Test cases of catalog sub-features mixed up all together.

  it('search sample test', () => {})

  it('detail view sample test', () => {})

  it('another search sample test', () => {})
})
```

## Arrange, Act, Assert (AAA) Pattern

Follow the AAA (Arrange, Act, Assert) pattern for writing tests, and separate each of them with a blank line.

### Example 1

```js
describe('Cart', () => {
  it('adds the Rocket to the cart', () => {
    // Arrange
    cy.visit('/')

    // Act
    cy.contains('[data-testid="emoji-card"]', 'Rocket').within(() => {
      cy.contains('button', 'Add to Cart').click()
    })
    cy.openCart()

    // Assert
    cy.contains('[data-testid="cart-item"]', 'Rocket').should('be.visible')
  })
})
```

> `cy.openCart()` stands for a custom command. See [Commands](./04-commands.md).

### Example 2 - Many tests with the same arrange steps

```js
describe('Search', () => {
  beforeEach(() => {
    // Arrange
    cy.visit('/')
  })

  it('finds an emoji by its name', () => {
    // Act
    cy.get('input[placeholder="Search emojis..."]').type('Rocket')

    // Assert
    cy.contains('[data-testid="emoji-card"]', 'Rocket').should('be.visible')
  })

  it('finds an emoji by its description', () => {
    // Act
    cy.get('input[placeholder="Search emojis..."]').type('space')

    // Assert
    cy.contains('[data-testid="emoji-card"]', 'Rocket').should('be.visible')
  })
})
```

> If many tests share the same arrange steps, move them to the `beforeEach` hook.

### Example 3 - Intermediate Assertions

Sometimes, intermediate assertions might be needed before the final ones to ensure the elements we want to interact with are really there.

```js
describe('Search', () => {
  it('finds an emoji by its name', () => {
    // Arrange
    cy.visit('/')

    cy.get('input[placeholder="Search emojis..."]')
      // Assert
      .should('be.visible')
      // Act
      .type('Rocket')

    // Assert
    cy.contains('[data-testid="emoji-card"]', 'Rocket').should('be.visible')
  })
})
```

## See Also

- [Selectors](./03-selectors.md) - Best practices for element selection
- [Commands](./04-commands.md) - Custom commands to reach a state through the UI
- [Assertions](./05-assertions.md) - Assertion strategies

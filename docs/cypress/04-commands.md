# Cypress Commands and Best Practices

> **Part of:** [Cypress Instructions](./cypress.md)

This guide covers best practices for using Cypress commands, including waiting for a state, custom commands, and common pitfalls to avoid.

## Working with the `.last()` Element

When working with the `.last` element, make sure the correct number of elements are visible before getting the last.

This ensures you are selecting the correct element, especially in scenarios where multiple elements with the same selector may render at different times, such as in a dynamic list.

**Good example** 👍

```js
cy.get('[data-testid="emoji-card"]')
  // Assert the expected number of elements.
  .should('have.length', 6)
  // All cards rendered, now get the last one and make an assertion.
  .last()
  .should('contain', 'Glowing Star')
```

**Bad example** 👎

```js
cy.get('[data-testid="emoji-card"]')
  .last() // This may select the wrong element if the list is still rendering.
  .should('contain', 'Glowing Star')
```

## `cy.wait(Number)` is Strictly Forbidden

**NO EXCEPTION** - Using `cy.wait()` with a hardcoded number is strictly forbidden.

Instead of doing something like this: 👎

```js
cy.get(...).click()

cy.wait(3000)

cy.get(...).should('be.visible')
```

Do something like this: 👍

```js
cy.get(...).click()

cy.contains('h2', 'Your Cart').should('be.visible')
```

That is **retry-ability**: assert the state you are waiting for, and Cypress retries the query and the assertion until it is true, or until the command times out. There is no network request to wait for in this app, so the state is all there is.

### Why This Matters

- Arbitrary waits make tests slower and non-deterministic
- Tests may pass on a fast machine but fail on a slow one
- Asserting the awaited state makes the test wait for the actual condition to be met
- This approach is faster when the state is reached quickly and more reliable when it takes longer

## Custom Commands

Every view of the app is at `/`, so a test reaches checkout by clicking through the store, every time. When the same steps repeat across specs, name them as custom commands in `cypress/support/commands.js`, such as `cy.addToCart(name)`, `cy.openCart()`, and `cy.goToCheckout()`.

Two rules apply to every custom command:

- **It ends with a positive assertion on the state it leads to.** A command that only clicks hands the next command a page that may not be there yet. One that asserts where it ended up both waits for that state and fails at the step that broke.
- **Every selector and text in it comes from `aria` or `dom` output read on that state.** There is no source code to check a test id against, so what Tap showed is the only evidence that it exists.

```js
Cypress.Commands.add('openCart', () => {
  // The cart button's selector, chosen per 03-selectors.md, goes here.

  cy.contains('h2', 'Your Cart').should('be.visible')
})
```

> A custom command that hides a broken step makes every test using it fail in the same place, far from the cause. Read the failing test with `reporter --test-id` before changing the command. See [Writing Tests with Cypress Tap](./07-cypress-tap.md).

## `cy.reload()`

`cy.reload()` is the only way to check what survives a reload. Use it in the test about that behavior, after a positive assertion on the state before the reload, and assert the state the requirement asks for after it.

```js
cy.addToCart('Rocket')

cy.reload()

// Assert what the requirement says survives the reload.
```

## See Also

- [Selectors](./03-selectors.md) - Selecting elements to interact with
- [Assertions](./05-assertions.md) - Proper assertion patterns
- [Code Quality](./06-code-quality.md) - Keeping tests deterministic

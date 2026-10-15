# Cypress Assertions and Expectations

> **Part of:** [Cypress Instructions](./cypress.md)

This guide covers best practices for writing assertions in Cypress tests, including what an assertion is for, choosing the right assertion type, and avoiding common mistakes.

## Assert the Requirement, Not the App

Every assertion traces back to a line of `docs/requirements.md`. The app shows what it **does**; the requirements say what it **should** do, and only they can tell a bug apart from a design.

- An assertion that copies what the app happens to do is not finished. For example, a search that matches nothing and a test that asserts zero cards is asserting the app, not the requirement for that case.
- A test that asserts a requirement the app breaks **fails**, and stays failing, with a one-line comment that says it fails on purpose. It is never changed to match the app, and never deleted.
- An assertion that checks something no requirement states (a description word for word, a length nobody promised) is asserting the current app. Cut it down to what a requirement does state.

## The `.should('be.visible')` vs. `.should('exist')` Assertions

If an element should be visible in the page, always assert that using the `.should('be.visible')` assertion.

Only asserting that an element exists in the DOM is not enough since the element might exist in the DOM but could be hidden by a CSS rule, for example.

### When to Use Each

- **`.should('be.visible')`** - Use when the element should be visible to users
- **`.should('exist')`** - Use only when you need to verify an element is in the DOM but don't care about visibility (rare cases)

**Good example** 👍

```js
cy.contains('[data-testid="emoji-card"]', 'Rocket').should('be.visible')
```

**Bad example** 👎

```js
cy.contains('[data-testid="emoji-card"]', 'Rocket').should('exist') // Not enough - element might be hidden
```

## Unnecessary Chain of Commands

It's not necessary to ensure the element exists in the DOM if you will assert that it's visible.

> An element cannot be visible without existing in the DOM.

**Good example** 👍

```js
cy.contains('[data-testid="emoji-card"]', 'Rocket').should('be.visible')
```

**Bad examples** 👎

```js
cy.contains('[data-testid="emoji-card"]', 'Rocket').should('exist').and('be.visible')

cy.contains('[data-testid="emoji-card"]', 'Rocket').should('be.visible').and('exist')
```

## Negative Assertions

Always run a positive assertion before a negative one to avoid tests passing prematurely.

**Good example** 👍

```js
it('removes the Rocket from the cart', () => {
  // The Rocket and the Rainbow are in the cart, which is open.

  // Remove the Rocket's line here.

  cy.contains('[data-testid="cart-item"]', 'Rainbow').should('be.visible') // Ensure you're in the right place before the negative assertion.
  cy.contains('[data-testid="cart-item"]', 'Rocket').should('not.exist')
})
```

**Bad example** 👎

```js
it('removes the Rocket from the cart', () => {
  // The Rocket and the Rainbow are in the cart, which is open.

  // Remove the Rocket's line here.

  cy.contains('[data-testid="cart-item"]', 'Rocket').should('not.exist') // Passes as well if the cart was never open
})
```

### Why Positive Assertions First?

- A negative assertion might pass immediately if you're not in the right state yet
- The positive assertion ensures you've reached the expected view or state
- This prevents false positives where tests pass for the wrong reasons

## Using `.its()` Effectively

When accessing properties, use `.its()` followed by assertions rather than `.should()` with callback functions when possible.

**Good example** 👍

```js
cy.get('[data-testid="emoji-card"]').should('have.length', 6)

cy.get('[data-testid="cart-item"]').its('length').should('be.at.least', 1)
```

## Money Is Text

A price or a total is shown as text, such as `$14.97`. Assert that text, exactly as a user reads it, on the element `dom` shows holding it. Read the markup first: whether a label and its amount share one element or sit in two decides how the assertion is written.

Never compute the expected amount in the test. In JavaScript, `4.99 * 3` is `14.970000000000002`, which is not what the page shows, and computing it tests the app with the app's own arithmetic. Write the expected value down, as the user would read it.

## Values That Change on Every Run

For a value that is different on every run, such as an order number, assert its **shape**, and only the shape the requirement gives:

```js
.should('match', /^[A-Z0-9]+$/)
```

Never assert a length, a prefix, or any other detail nobody promised. A test that relies on what the app happened to produce today fails the day it produces something else that is still right.

## Form Validation: Test the App, Not the Browser

When a form relies on the browser's own validation, the browser does the checking, and the browser is not what is under test. What the app decides is **which rule applies to which field**, and that is in the markup: a `required` attribute, a `type="email"`. Assert the attribute:

```js
cy.get('#email').should('have.attr', 'required')

cy.get('#email').should('have.attr', 'type', 'email')
```

Do not submit the form to watch the browser reject it, and do not assert the field's `validity` flags or its `validationMessage`. Those check that the browser implements `required` and `type="email"`, which it does, and the message also depends on the browser and its language.

A rule the markup cannot express (a card number with 16 digits, an expiry date not in the past) is the app's own. Test it through what the user sees: fill the field with a value that breaks the rule, every other field valid, submit, and assert that the purchase is not completed.

## See Also

- [Selectors](./03-selectors.md) - Selecting elements to assert on
- [Commands](./04-commands.md) - Commands that lead to assertions
- [Test Organization](./02-test-organization.md) - AAA pattern with assertions

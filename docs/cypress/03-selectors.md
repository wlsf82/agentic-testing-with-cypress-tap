# Cypress Selectors and Element Selection

> **Part of:** [Cypress Instructions](./cypress.md)

This guide covers best practices for selecting elements in Cypress tests, including selector strategies, alias usage, and what to do when the app offers no good selector at all.

## Selector Principles

First of all:

- Selectors should be resilient to UI changes
- Selectors should reveal intent, not implementation details
- Selectors should be consistent across the entire project
- Selectors should be as simple as possible

## Recommended Selectors Strategy

The recommended selectors approach is as follows.

```js
// If data-testid or similar exist, use them.
cy.get('[data-testid="emoji-card"]')
// If data-testid is not available, use accessibility (A11y) properties such as aria-label for element selection.
cy.get('[aria-label="..."]')
// If none of the above are present, try descriptive selectors.
cy.get('input[placeholder="Search emojis..."]')
// Otherwise, use id.
cy.get('#email')
```

**Priority:** `[data-testid]` > `[aria-label]` > descriptive attributes > `#id`

> This app has no `aria-label` at all. The rung is kept for the day it does.

Every selector comes from what Cypress Tap shows (`aria`, `dom`, `inspect`) on the state the test is in, never from a guess. See [Writing Tests with Cypress Tap](./07-cypress-tap.md).

## An App You Cannot Change

On a project where you can change the app, a missing `data-testid` is a one-line pull request. Here, there is none to open: the test ids the app offers are the only ones there are.

So combine what the app offers. A test id that matches many elements, plus `cy.contains` with the text that makes it specific, picks one:

```js
cy.contains('[data-testid="emoji-card"]', 'Rocket') // The Rocket's card, and only it.
```

Read it as a sentence: "the emoji card that contains Rocket".

## What to Avoid

**Avoid** 👎

- Generic classes (e.g., `.btn`)
- Styling and dynamic classes (e.g., `.text-sm`, `.bg-blue-500`, `.Messenger_openButton_OgKIA`). They change whenever the design does
- Positional selectors used to pick an element (e.g., `.eq(1)`, `:first`, `:last`, `.first()`, `.last()`). A position says nothing about which element the test meant, and breaks when the layout changes
- Long and hard-to-read selectors (e.g., `cy.get('div > div > button')`)
- **XPATH - NEVER USE XPATH!**

> `.last()` after a length assertion is allowed when the last element is the point of the test. See [Commands](./04-commands.md).

## Using `cy.contains`

Below are examples of how to use and how not to use the `contains` command.

**Good examples** 👍

```js
cy.contains('button', 'Complete Purchase') // Element type + element's content that makes it specific.

cy.contains('[data-testid="cart-item"]', 'Rocket') // Test id + content that makes it specific.
```

**Bad examples** 👎

```js
cy.contains('Complete Purchase') // Too generic

cy.get('button').contains('Complete Purchase') // Too many chainings

cy.get('button:contains(Complete Purchase)') // Too complex as it depends on jQuery's :contains
```

### A Text the App Does Not Show

When a requirement names a text and the app does not show it, there is no element to read with Tap, so there is no way to know its tag. Then `cy.contains('<text>')` without an element type is allowed, because the text is all you have:

```js
// The requirement names this message; the app shows no element to read its tag from.
cy.contains('No emojis found').should('be.visible')
```

## Checkout Fields

Every checkout input has a `label` whose `for` matches the input's `id`. Select the field by its `id`, the descriptive last resort the app offers, and use the label only where the label itself is the point of the test:

```js
cy.get('#email').type('shopper@example.com')

cy.contains('label', 'Email').should('be.visible')
```

## A Button with No Name and No Test Id

Some buttons in this app are icon-only: no text, no `aria-label`, no `data-testid`. A screen reader announces each of them as "button", and a test has nothing human-readable to find them by. Never fall back on a position or a styling class. Instead, do three things:

1. **Scope to the nearest element with a test id.** For a button inside an element that has one, `cy.contains('[data-testid="<test-id>"]', '<name>')` picks the right element and rules out the buttons of every other one.
2. **Inside it, use the most meaningful thing `dom` shows** that tells the buttons apart: something that says what the button **is** to a reader of the markup, never a styling class and never a position. Read the markup with `npx cypress tap dom --selector '<scope>' --at <index>` before choosing.
3. **Leave a comment that names the gap**, so nobody mistakes the workaround for a choice:

```js
// The cart item's buttons have no accessible name and no test id.
// This is the least bad stable selector; see the finding in exploration/findings.md.
```

Then, separately from the test, **write the gap down as a finding** in `exploration/findings.md`. A button with no accessible name is not only a testing inconvenience: it is a problem for anyone using a screen reader.

## Aliases: `cy.get('selector').as('alias')` and `cy.get('@alias')`

To avoid repeating the same selector over and over, give aliases to elements, and then get them by their aliases.

**Good example** 👍

```js
describe('Checkout', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.addToCart('Rocket')
    cy.goToCheckout()

    cy.get('#email').as('email')
  })

  it('requires an email', () => {
    cy.get('@email').should('have.attr', 'required')
  })

  it('asks for an email address', () => {
    cy.get('@email').should('have.attr', 'type', 'email')
  })
})
```

**Bad example** 👎

```js
describe('Checkout', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.addToCart('Rocket')
    cy.goToCheckout()
  })

  it('requires an email', () => {
    cy.get('#email').should('have.attr', 'required')
  })

  it('asks for an email address', () => {
    cy.get('#email').should('have.attr', 'type', 'email')
  })
})
```

## See Also

- [Commands](./04-commands.md) - Interacting with selected elements, and `.last()`
- [Assertions](./05-assertions.md) - Asserting on element state
- [Writing Tests with Cypress Tap](./07-cypress-tap.md) - Reading the app to find selectors

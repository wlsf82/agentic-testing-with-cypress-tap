# Minus at quantity 1 does not remove the item from the cart

## Environment

- App: Emoji Mart, <https://emoji-mart-one.vercel.app>
- Browser: Chrome 155.0.8059.80 (Official Build) (arm64), driven by Cypress 16.2.0 (`cypress open --e2e --browser chrome`), read with Cypress Tap
- Date: 2026-10-17

## Requirement

> Pressing minus on an item whose quantity is 1 removes the item from the cart.

(`docs/requirements.md`; test plan C9)

## Preconditions

- The store is open at `/`.
- The cart holds two Rockets and one Rainbow.
- The cart is open.

## Steps to reproduce

1. On the Rainbow's line, press the minus button.

## Expected result

The Rainbow's line is removed from the cart. The Rocket's line stays.

## Actual result

The Rainbow's line stays in the cart with quantity 1. The Rocket's line stays, as expected.

The only way to take out an item whose quantity is 1 is the remove button. Minus works above 1: from two Rockets, minus leaves one (`cart.cy.js` › "takes one unit away with minus", `r15`, passed).

## Evidence

Skipped test that reproduces the bug: `cypress/e2e/cart.cy.js` › Lines › Buttons › "removes the item when minus is pressed at quantity 1" (`r16`).

Fresh verdict on 2026-10-17, run `startedAt` 2026-10-17T19:00:43.731Z. Every row before the last passed, including the click on minus. The test failed on the assertion that states the requirement:

```text
Timed out retrying after 4000ms: Expected not to find content: 'Rainbow' within the selector: '[data-testid="cart-item"]' but continuously found it.
```

Pinned at that row, `dom` on the Rainbow's line shows it still in the cart, with `<span data-testid="cart-item-counter">1</span>`.

## Severity

**Minor.** The shopper can still take the item out with the remove button, but minus does nothing at 1, which looks broken.

## Priority

**Medium.** Every shopper who lowers a quantity runs into it, and the workaround is easy to find.

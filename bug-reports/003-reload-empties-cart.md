# A page reload empties the cart

## Environment

- App: Emoji Mart, <https://emoji-mart-one.vercel.app>
- Browser: Chrome 155.0.8059.80 (Official Build) (arm64), driven by Cypress 16.2.0 (`cypress open --e2e --browser chrome`), read with Cypress Tap
- Date: 2026-10-17

## Requirement

> The cart keeps its contents when the page is reloaded.

(`docs/requirements.md`; test plan C14)

## Preconditions

- The store is open at `/`.
- The cart holds one Rocket. The cart button in the header shows "1".

## Steps to reproduce

1. Reload the page.
2. Open the cart with the cart button in the header.

## Expected result

The cart has the Rocket's line, with quantity 1.

## Actual result

The cart is empty: it shows "Your cart is empty", and the cart button in the header has no badge.

## Evidence

Skipped test that reproduces the bug: `cypress/e2e/cart.cy.js` › Keeping the contents › "keeps its contents when the page is reloaded" (`r24`).

Fresh verdict on 2026-10-17, run `startedAt` 2026-10-17T19:00:43.731Z. Before the reload, the cart button had the text `'1'`. After it, the test failed on the assertion that states the requirement:

```text
Timed out retrying after 4000ms: Expected to find content: 'Rocket' within the selector: '[data-testid="cart-item"]' but never did.
```

Pinned at the open cart (command 16), `dom` shows `<div data-testid="empty-cart"><p>Your cart is empty</p></div>`, and the header's cart button has no badge.

## Severity

**Major.** The shopper loses everything they picked, without warning.

## Priority

**Medium.** It loses the shopper's work, but only after a reload, and they can add the items again.

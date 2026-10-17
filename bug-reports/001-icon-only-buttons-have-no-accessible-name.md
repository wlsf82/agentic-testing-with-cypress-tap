# Icon-only buttons have no accessible name

## Environment

- App: Emoji Mart, <https://emoji-mart-one.vercel.app>
- Browser: Chrome 155.0.8059.80 (Official Build) (arm64), driven by Cypress 16.2.0 (`cypress open --e2e --browser chrome`), read with Cypress Tap
- Date: 2026-10-17

## Requirement

> A screen reader announces the cart button as "Open cart", the remove button of the Rocket's line as "Remove Rocket".

(`docs/requirements.md`, accessibility; test plan X2–X6)

## Preconditions

Each case below starts from the store at `/`, in a different state:

- **Case A:** the cart is empty.
- **Case B:** one Rocket is in the cart, and the cart is open.

## Steps to reproduce

**Case A** (empty cart)

1. Read the accessible name of the cart button in the header.

**Case B** (Rocket in the open cart)

1. Read the accessible name of every button on the page, in page order.

## Expected result

- **Case A:** the cart button's name is "Open cart".
- **Case B:** every button has a name that says what it does, e.g. "Close cart", and, on the Rocket's line, "Remove Rocket".

## Actual result

- **Case A:** the cart button has no name. The accessibility tree shows a bare `button`.
- **Case B:** the cart button's only name is its badge's unit count, "1", not "Open cart". The close button and the Rocket line's minus, plus, and remove buttons have no name. A screen reader announces each of them as "button".

These buttons have no text, no `aria-label`, and no `title`. Only their icon tells them apart:

| Button | Where | Icon (from `dom`) |
| --- | --- | --- |
| Open cart | `header` | `svg.lucide-shopping-cart` |
| Close cart | The cart's title bar, next to "Your Cart" | `svg.lucide-x` |
| Minus | Each cart line | `svg.lucide-minus-circle` |
| Plus | Each cart line | `svg.lucide-plus-circle` |
| Remove | Each cart line | `svg.lucide-trash2` |

## Evidence

Skipped tests that reproduce the bug, in `cypress/e2e/cart.cy.js` › Accessibility. Fresh verdict on 2026-10-17, run `startedAt` 2026-10-17T19:33:48.619Z, both failed on the assertion that states the requirement:

- **Case A:** "announces the cart button as "Open cart"" (`r26`):

  ```text
  expected '' to equal 'Open cart'
  ```

- **Case B:** "gives every button an accessible name that says what it does" (`r27`). The cart button and the six "Add to Cart" buttons passed, then the close button (`lucide-x`) failed:

  ```text
  expected '' not to be empty
  ```

  The test stops at the first button with no name, so it does not check the minus, plus, and remove buttons.

Fresh `aria` reads, 2026-10-17:

- `checkout.cy.js`, test `r17`, pinned at command 14, Rocket in the open cart: the close, minus, plus, and remove buttons are a bare `button`, and the cart button reads `button  1`.
- `cart.cy.js`, test `r24`, pinned at command 16, empty cart: the cart button is a bare `button`.

## Severity

**Major.** A screen reader user cannot tell which button opens or closes the cart, or changes or removes a line, so they cannot manage their cart.

## Priority

**High.** It blocks shopping for screen reader users, and the fix is small: an `aria-label` on each icon-only button.

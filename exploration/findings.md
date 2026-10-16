# Emoji Mart findings

Gaps found while writing tests. Each one is something a user, not only a test, runs into.

## Icon-only buttons have no accessible name and no test id

Found on 2026-10-17, writing `cypress/e2e/cart.cy.js`.

`aria` shows these as a bare `button`: no text, no `aria-label`, no `data-testid`. A screen reader announces each of them as "button", which breaks the accessibility requirement ("a screen reader announces the cart button as 'Open cart', the remove button of the Rocket's line as 'Remove Rocket'"; test plan X2–X6).

| Button | Where | Only thing that tells it apart (from `dom`) |
| --- | --- | --- |
| Open cart | `header` | `svg.lucide-shopping-cart` |
| Close cart | The cart's title bar, next to `h2` "Your Cart" | `svg.lucide-x` |
| Minus | Each `[data-testid="cart-item"]` | `svg.lucide-minus-circle` |
| Plus | Each `[data-testid="cart-item"]` | `svg.lucide-plus-circle` |
| Remove | Each `[data-testid="cart-item"]` | `svg.lucide-trash2` |

The tests scope to the nearest element with a test id (or, for the header and the cart's title bar, the nearest meaningful container) and pick the button by its icon, e.g. `button:has(.lucide-trash2)`. That is the least bad stable selector, not a choice: an `aria-label` per button would fix both the accessibility gap and the selectors.

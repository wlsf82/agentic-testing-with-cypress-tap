# Emoji Mart feature map

What the app does, as seen through Cypress Tap (`aria`, `dom`, `inspect`, `reporter`, `pin`) on 2026-10-16, against https://emoji-mart-one.vercel.app. Every state below was reached by a test in `cypress/e2e/explore.cy.js` (16 tests, last fresh verdict: 16 passed, `startedAt` 2026-10-16T18:22:54.558Z). `docs/requirements.md` was not read; this map says what the app does, not what it should do.

Anything not seen in the app is marked **Assumption**.

## Global facts

- The URL stays `/` in every view. A view is told apart by its headings and buttons, not by the URL.
- **Assumption:** a reload resets the app (cart included). Not tried during this exploration; it comes from the project rules.
- No network rows appeared in the Command Log of the purchase test (`r7`).
- The app has **no `aria-label`** anywhere seen.
- Every icon-only button has **no accessible name and no test id** (`aria` shows a bare `button`): the header cart button, the cart's close button, and each cart item's −, +, and trash buttons. Only their Lucide icon class (`lucide-shopping-cart`, `lucide-x`, `lucide-minus-circle`, `lucide-plus-circle`, `lucide-trash2`) tells them apart.

## `data-testid` attributes found

| Test id | Where | What it marks |
| --- | --- | --- |
| `emoji-card` | Store | Each emoji card (6 with an empty search) |
| `empty-cart` | Cart drawer | The "Your cart is empty" block |
| `cart-item` | Cart drawer | Each line of the cart |
| `cart-item-counter` | Cart drawer, inside `cart-item` | The line's quantity |

No other `data-testid` was seen in any view.

## Views

### 1. Store (home)

**How to get there:** `cy.visit('/')`. Also via "← Back to all emojis" (detail), "← Back to store" (checkout), and "Back to Store" (confirmation).

**Header (`banner`)**

- `h1` "EmojiMart"
- Cart button (`header button`): icon `lucide-shopping-cart`, no name. When the cart has units, it holds a `span` badge with the number of units (seen: `1`, `2`); with an empty cart there is no badge.

**Main**

- Search box: `input[type="text"][placeholder="Search emojis..."]`, accessible name "Search emojis...", no `id`, no label.
- A grid of six `[data-testid="emoji-card"]`. Each card has an emoji, an `h3` name, a `p` description, a price `span`, and a `button` "Add to Cart" (with a cart icon). The upper part of the card (`div.cursor-pointer`) opens the detail view.

| Emoji | Name | Description | Price |
| --- | --- | --- | --- |
| 😊 | Smiling Face | A classic yellow smiling face showing happiness and joy | $4.99 |
| 🚀 | Rocket | A rocket shooting up into space | $6.99 |
| 🌈 | Rainbow | A beautiful rainbow with all colors | $5.99 |
| 💖 | Sparkling Heart | A pink heart with sparkles | $3.99 |
| 🎮 | Game Controller | Video game controller | $7.99 |
| 🌟 | Glowing Star | A yellow star with a glowing effect | $4.99 |

**Behaviour seen**

- "Add to Cart" on a card adds one unit and updates the header badge.
- Search filters the cards as you type:
  - `rock` → only Rocket (lowercase query matched "Rocket").
  - `space` → only Rocket (matched a word that is only in its description).
  - `xyzzy` → no card at all, the grid is empty, and **no message** is shown.
- **Assumption:** the search is case-insensitive in general. Only a lowercase query against a capitalized name was tried.
- **Assumption:** clicking "Add to Cart" twice on the same card makes one line with quantity 2. Not tried; only the + button in the cart was.

### 2. Emoji detail

**How to get there:** Store → click a card (`cy.contains('[data-testid="emoji-card"]', 'Rocket').click()`). Only the Rocket was opened.

- The header (with the cart button) and the search box stay on screen.
- `button` "← Back to all emojis" → back to the store with all six cards.
- A large emoji (🚀), `h2` "Rocket", `p` "A rocket shooting up into space", price "$6.99", `button` "Add to Cart" (no icon here).
- "Add to Cart" here adds one unit (badge went to `1`).
- No `data-testid` in this view.
- **Assumption:** the other five emojis have the same detail layout. Not opened.
- **Assumption:** typing in the search box from the detail view does something. Not tried.

### 3. Cart drawer

**How to get there:** click the header cart button (`header button`), from the store. It opens as an overlay (`div.fixed`) on top of the store, which stays rendered underneath.

**Always present**

- `h2` "Your Cart"
- Close button: icon `lucide-x`, no name. Clicking it removes the drawer (the "Your Cart" heading no longer exists).

**Empty cart**

- `[data-testid="empty-cart"]` with `p` "Your cart is empty". No total, no checkout button.

**Cart with items**

- One `[data-testid="cart-item"]` per emoji, in the order they were added (Rocket, then Rainbow). Each has the emoji, an `h3` name, a `p` unit price, and:
  - − button (`lucide-minus-circle`), no name
  - `[data-testid="cart-item-counter"]` with the quantity
  - + button (`lucide-plus-circle`), no name
  - trash button (`lucide-trash2`), no name
- "Total:" and the total amount.
- `button` "Proceed to Checkout".

**Behaviour seen**

| Action | Counter | Badge | Total |
| --- | --- | --- | --- |
| Rocket added once | 1 | 1 | $6.99 |
| + on Rocket | 2 | 2 | $13.98 (unit price stays $6.99) |
| − on Rocket at quantity 1 | stays 1, line stays | 1 | $6.99 |
| Trash on Rocket | line gone, `empty-cart` shown | no badge | — |
| Rocket + Rainbow, once each | 1 and 1 | 2 | $12.98 |

- **Assumption:** − at quantity 2 or more lowers it by one. Only − at quantity 1 was tried.
- **Assumption:** clicking the dark overlay outside the panel closes the drawer. Not tried.
- **Assumption:** the cart can be opened from the detail view. Not tried.

### 4. Checkout

**How to get there:** Store → add an emoji → cart button → "Proceed to Checkout".

- The header shows only "EmojiMart": **no cart button** in this view. The search box is gone too.
- `button` "← Back to store" → back to the store, cart kept (badge still `1`), drawer closed.
- A `form` with three sections (`h3`) and a submit button. Every input has a `label` whose `for` matches its `id`, and every input is `required`:

| Section | Label | Selector | `type` | `placeholder` |
| --- | --- | --- | --- | --- |
| Contact Information | Email | `#email` | `email` | — |
| Contact Information | Full Name | `#name` | `text` | — |
| Shipping Address | Street Address | `#address` | `text` | — |
| Shipping Address | City | `#city` | `text` | — |
| Shipping Address | Country | `#country` | `text` | — |
| Payment Information | Card Number | `#cardNumber` | `text` | `1234 5678 9012 3456` |
| Payment Information | Expiry Date | `#expiryDate` | `text` | `MM/YY` |
| Payment Information | CVV | `#cvv` | `text` | `123` |

- "Total Amount:" with the cart total ($6.99 with one Rocket). `aria` does not show this text; `dom` does.
- `button[type="submit"]` "Complete Purchase".

**Behaviour seen**

- Submitting the empty form keeps the checkout on screen and moves focus to Email. The browser's validation bubble is not part of the page, so Tap cannot show it.
- **Assumption:** the app validates the card number, expiry date, or CVV format beyond `required`. Only valid-looking values were typed; no `pattern`, `maxlength`, or `inputmode` attribute was seen.
- **Assumption:** the checkout can be reached with an empty cart. The "Proceed to Checkout" button was only seen with items in the cart.

### 5. Order confirmation

**How to get there:** Checkout → fill every field → "Complete Purchase".

- Replaces the whole page: no header, no search box.
- A check icon (`lucide-check`).
- `h1` "Thank You for Your Purchase!"
- `p` "Your order has been successfully placed. We've sent a confirmation email with your order details."
- "Order Number" and a code (seen: `4T2RAX7Q`).
- `button` "Back to Store" → back to the store with an **empty cart** (no badge, drawer shows `empty-cart`).
- **Assumption:** the order number is generated on each purchase. Only one value was read.
- **Assumption:** a confirmation email is actually sent. The app says so, but it made no network request that the Command Log showed.

## Not reached or not tried

- The detail view of any emoji other than the Rocket.
- A reload in the middle of a flow (does the cart survive?).
- − on a quantity above 1; "Add to Cart" twice on the same card; a large quantity (badge with two digits).
- Closing the drawer by clicking the overlay, or with Escape.
- Opening the cart from the detail view.
- Checkout with invalid email, card number, expiry date, or CVV values.
- Search with uppercase or mixed case, with leading or trailing spaces, or by price.
- Any view on a narrow (mobile) viewport.
- Keyboard-only navigation.

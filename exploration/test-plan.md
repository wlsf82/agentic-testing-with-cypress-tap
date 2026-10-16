# Emoji Mart test plan

Each behaviour in `docs/requirements.md`, compared line by line with what `exploration/feature-map.md` (2026-10-16) says the app does.

- **matches**: the map shows the app doing what the requirement says.
- **deviates**: the map shows the app doing something else. The line quotes the requirement and says what the map saw.
- **not covered**: the map did not reach or try it (or lists it only as an **Assumption**), so there is no evidence either way yet.

Every line is a test to write. A **deviates** line is a test expected to fail until the app is fixed; its assertion states the requirement, not what the app does.

## Summary

| Status | Count |
| --- | --- |
| matches | 33 |
| deviates | 7 |
| not covered | 15 |

## The store

| # | Behaviour | Status | Notes |
| --- | --- | --- | --- |
| S1 | The name "EmojiMart" is shown at the top of the page | matches | `h1` "EmojiMart" in the header. |
| S2 | The store sells six emojis, each with a symbol, name, description, and price in US dollars | matches | Six `emoji-card`s with an empty search. |
| S3 | Prices: Smiling Face $4.99, Rocket $6.99, Rainbow $5.99, Sparkling Heart $3.99, Game Controller $7.99, Glowing Star $4.99 | matches | All six prices in the map's table match. |
| S4 | Each card shows the symbol, name, description, price, and an "Add to Cart" button | matches | |
| S5 | Prices are shown with a dollar sign and two decimal places | matches | Every price seen (cards, detail, cart, totals) has this format. |

## Search

| # | Behaviour | Status | Notes |
| --- | --- | --- | --- |
| Q1 | The search box has the placeholder "Search emojis..." | matches | |
| Q2 | A search matches an emoji's name | matches | `rock` → only Rocket. |
| Q3 | A search matches an emoji's description | matches | `space` → only Rocket. |
| Q4 | A lowercase query matches a capitalized name | matches | `rock` matched "Rocket". |
| Q5 | An uppercase or mixed-case query matches, ignoring case | not covered | Only lowercase queries were tried. |
| Q6 | While a search is active, only the matching emojis are shown | matches | |
| Q7 | Clearing the search shows every emoji again | not covered | Clearing the box was not tried. |
| Q8 | A search that matches no emoji shows "No emojis found" | **deviates** | See below. |

**Q8.** Requirement: "A search that matches no emoji shows the message 'No emojis found'." The map says that `xyzzy` leaves the grid empty, with no card at all, and **no message** is shown.

## An emoji's page

| # | Behaviour | Status | Notes |
| --- | --- | --- | --- |
| P1 | Clicking an emoji's symbol, name, or description opens its page | matches | Seen for the Rocket only, by clicking the card's upper part (`div.cursor-pointer`, which holds the symbol, name, and description). Symbol, name, and description were not clicked one by one. |
| P2 | The other five emojis open their own page | not covered | Only the Rocket was opened. |
| P3 | The page shows the emoji's symbol, name, description, and price | matches | 🚀, "Rocket", its description, $6.99. |
| P4 | The page's "Add to Cart" adds the emoji to the cart | matches | Badge went to 1. |
| P5 | "← Back to all emojis" returns to the store | matches | All six cards shown again. |

## Cart

| # | Behaviour | Status | Notes |
| --- | --- | --- | --- |
| C1 | "Add to Cart" adds one unit of that emoji | matches | Counter 1, badge 1. |
| C2 | Adding an emoji already in the cart increases its quantity instead of adding a second line | not covered | **Assumption** in the map; "Add to Cart" twice on the same emoji was not tried. |
| C3 | The cart icon shows how many units the cart holds, counting each unit of each emoji | matches | Badge 2 for Rocket ×2, and 2 for Rocket + Rainbow; no badge when empty. |
| C4 | A two-digit unit count is shown on the cart icon | not covered | Not tried (a requirement edge of C3). |
| C5 | The cart icon opens the cart, titled "Your Cart" | matches | |
| C6 | Each line shows the emoji, its price, and its quantity | matches | Symbol, name, unit price, `cart-item-counter`. |
| C7 | Plus on a line adds one unit | matches | Rocket 1 → 2, total $13.98. |
| C8 | Minus on a line with quantity above 1 takes one unit away | not covered | **Assumption** in the map; only minus at quantity 1 was tried. |
| C9 | Minus on a line with quantity 1 removes the item from the cart | **deviates** | See below. |
| C10 | The remove button takes the whole line out of the cart | matches | Trash on Rocket removed the line and showed the empty cart. Tried at quantity 1 only. |
| C11 | The total, labelled "Total:", is the sum of price × quantity | matches | $13.98 for Rocket ×2; $12.98 for Rocket + Rainbow. |
| C12 | An empty cart shows "Your cart is empty" | matches | `[data-testid="empty-cart"]`. |
| C13 | The cart can be closed without changing its contents | not covered | The close button (`lucide-x`) closes the drawer, but the contents were not checked after closing. Closing by overlay or Escape was not tried. |
| C14 | The cart keeps its contents when the page is reloaded | not covered | Not tried. The map's **Assumption** (from the project rules) is that a reload resets the cart, which would be a deviation; it needs a test. |
| C15 | The cart can be opened from an emoji's page | not covered | The header cart button is on screen there, but opening it was not tried. |

**C9.** Requirement: "Pressing minus on an item whose quantity is 1 removes the item from the cart." The map says that minus on the Rocket at quantity 1 leaves the counter at 1 and the line in the cart (badge 1, total $6.99).

## Checkout

| # | Behaviour | Status | Notes |
| --- | --- | --- | --- |
| K1 | From a cart that is not empty, "Proceed to Checkout" opens the checkout | matches | |
| K2 | The checkout asks for Email and Full Name, Street Address, City, and Country, and Card Number, Expiry Date, and CVV | matches | Three sections, eight labelled fields. |
| K3 | Every field is required | matches | Every input has `required`; submitting the empty form keeps the checkout and focuses Email. |
| K4 | The email must be a valid email address | not covered | `#email` is `type="email"`, but no invalid email was submitted. |
| K5 | The card number must have 16 digits, spaces between groups allowed | not covered | Only valid-looking values were typed; no `pattern` or `maxlength` was seen. |
| K6 | The expiry date must be in the format MM/YY | not covered | Same as K5. |
| K7 | The expiry date must not be in the past | not covered | Same as K5. |
| K8 | The CVV must have 3 digits | not covered | Same as K5. |
| K9 | An invalid email, card number, expiry date, or CVV stops the purchase and shows a message next to that field | not covered | Not tried. The only validation seen is the browser's own bubble for empty fields, which is not a message in the page. |
| K10 | The checkout shows the cart's total, labelled "Total Amount:" | matches | $6.99 for one Rocket. |
| K11 | "← Back to store" returns to the store with the cart as it was | matches | Badge still 1. |
| K12 | "Complete Purchase" completes the purchase when every field is valid | matches | |

## After a purchase

| # | Behaviour | Status | Notes |
| --- | --- | --- | --- |
| A1 | A completed purchase shows the heading "Thank You for Your Purchase!" | matches | |
| A2 | The page shows an order number made of uppercase letters and digits | matches | One value seen: `4T2RAX7Q`. |
| A3 | After a purchase, the cart is empty | matches | No badge; the drawer shows `empty-cart`. |
| A4 | "Back to Store" returns to the store | matches | |

## Accessibility

| # | Behaviour | Status | Notes |
| --- | --- | --- | --- |
| X1 | Text buttons have an accessible name that says what they do | matches | "Add to Cart", "← Back to all emojis", "Proceed to Checkout", "← Back to store", "Complete Purchase", "Back to Store". |
| X2 | The cart button is announced as "Open cart" | **deviates** | See below. |
| X3 | The cart's close button has an accessible name | **deviates** | See below. |
| X4 | Each line's minus button has an accessible name | **deviates** | See below. |
| X5 | Each line's plus button has an accessible name | **deviates** | See below. |
| X6 | Each line's remove button is announced as "Remove" plus the emoji's name (e.g. "Remove Rocket") | **deviates** | See below. |

**X2–X6.** Requirement: "Every button has an accessible name that says what it does: a screen reader announces the cart button as 'Open cart', the remove button of the Rocket's line as 'Remove Rocket', and so on." The map says that every icon-only button has **no accessible name** (`aria` shows a bare `button`), no `aria-label`, and no test id: the header cart button (`lucide-shopping-cart`), the cart's close button (`lucide-x`), and each line's minus (`lucide-minus-circle`), plus (`lucide-plus-circle`), and trash (`lucide-trash2`) buttons. Only their icon class tells them apart.

## In the map, not in the requirements

These behaviours were seen but no requirement covers them. They are not tests to write against the requirements; they are listed so nobody mistakes them for requirements.

- The checkout hides the header cart button and the search box.
- The confirmation page hides the header and the search box.
- The search box stays on screen on an emoji's page; typing there was not tried.
- An empty cart has no "Proceed to Checkout" button (consistent with K1, which only requires the button for a cart that is not empty).

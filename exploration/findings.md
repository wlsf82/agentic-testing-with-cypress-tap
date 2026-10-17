# Emoji Mart findings

Gaps found while writing tests. Each one is something a user, not only a test, runs into.

Each finding has one type:

- **Bug**: the app breaks a line of `docs/requirements.md`. It quotes that line and the Cypress Tap evidence.
- **Design choice**: the app does something the requirements allow, or that no requirement covers. It quotes the line that allows it, or says none does.
- **Question**: something seen that the browser cannot settle. It says what was seen, why the browser cannot settle it, and what to ask.

Every verdict below was read fresh on 2026-10-17: `cart.cy.js` (`startedAt` 2026-10-17T19:00:43.731Z, 13 passed, 2 failed), `search.cy.js` (19:01:32.440Z, 9 passed, 1 failed), `checkout.cy.js` (19:01:52.556Z, 10 passed, 4 failed).

The accessibility pass (found on 2026-10-18) was read from `explore.cy.js` (`startedAt` 2026-10-17T22:47:04.668Z, 16 passed), pinned at four states: the store (`r5`, command 2), the Rocket's page (`r3`, command 8), the cart with the Rocket (`r5`, command 15), and the checkout (`r6`, command 19).

## Icon-only buttons have no accessible name and no test id

**Type:** bug. Found on 2026-10-17, writing `cypress/e2e/cart.cy.js`.

`aria` shows these as a bare `button`: no text, no `aria-label`, no `data-testid`. A screen reader announces each of them as "button", which breaks the accessibility requirement ("a screen reader announces the cart button as 'Open cart', the remove button of the Rocket's line as 'Remove Rocket'"; test plan X2–X6).

| Button | Where | Only thing that tells it apart (from `dom`) |
| --- | --- | --- |
| Open cart | `header` | `svg.lucide-shopping-cart` |
| Close cart | The cart's title bar, next to `h2` "Your Cart" | `svg.lucide-x` |
| Minus | Each `[data-testid="cart-item"]` | `svg.lucide-minus-circle` |
| Plus | Each `[data-testid="cart-item"]` | `svg.lucide-plus-circle` |
| Remove | Each `[data-testid="cart-item"]` | `svg.lucide-trash2` |

The tests scope to the nearest element with a test id (or, for the header and the cart's title bar, the nearest meaningful container) and pick the button by its icon, e.g. `button:has(.lucide-trash2)`. That is the least bad stable selector, not a choice: an `aria-label` per button would fix both the accessibility gap and the selectors.

Fresh `aria` on 2026-10-17 (`checkout.cy.js`, test `r17`, pinned at command 14, with the Rocket in the cart): the close, minus, plus, and remove buttons are a bare `button`. The cart button reads `button  1`: its only name is the unit count from its badge, which a screen reader announces as "1", not "Open cart". With an empty cart (`cart.cy.js`, `r24`, pinned at command 16) it is a bare `button` again.

Tests: `cart.cy.js` › Accessibility (fresh verdict `startedAt` 2026-10-17T19:33:48.619Z, both failed on the assertion that states the requirement):

- "announces the cart button as "Open cart"" (`r26`), with an empty cart: `expected '' to equal 'Open cart'`.
- "gives every button an accessible name that says what it does" (`r27`), with the Rocket in the open cart: the cart button and the six "Add to Cart" buttons pass, then the close button (`lucide-x`) fails with `expected '' not to be empty`.

Limits of the second test, to keep in mind when reading its verdict:

- **It stops at the first button with no name.** The `expect` inside `.each` ends the test there, so the minus, plus, and remove buttons are never checked while the close button fails. `aria` shows them as a bare `button` too, but the test does not prove it. Fixing the close button alone will move the failure to the next one.
- **`aria-labelledby` counts as a name by its value**, which is an id, not a name. A button that points at a missing or empty element passes, although a screen reader announces nothing.

## Minus at quantity 1 does not remove the item

**Type:** bug. Test: `cart.cy.js` › "removes the item when minus is pressed at quantity 1" (`r16`, test plan C9).

Requirement: "Pressing minus on an item whose quantity is 1 removes the item from the cart."

Evidence: every row before the last passed, including the click on the Rainbow line's `button:has(.lucide-minus-circle)`. The test failed on the assertion that states the requirement:

```text
Timed out retrying after 4000ms: Expected not to find content: 'Rainbow' within the selector: '[data-testid="cart-item"]' but continuously found it.
```

Pinned at that row, `dom` on the Rainbow line shows it still in the cart with `<span data-testid="cart-item-counter">1</span>`. Minus works above 1: "takes one unit away with minus" (`r15`, Rocket 2 → 1) passed. The only way to take an item at quantity 1 out is the remove button.

## A reload empties the cart

**Type:** bug. Test: `cart.cy.js` › "keeps its contents when the page is reloaded" (`r24`, test plan C14).

Requirement: "The cart keeps its contents when the page is reloaded."

Evidence: before `cy.reload()`, the cart button had the text `'1'`. After it, the test failed on the assertion that states the requirement:

```text
Timed out retrying after 4000ms: Expected to find content: 'Rocket' within the selector: '[data-testid="cart-item"]' but never did.
```

Pinned at the open cart (command 16), `dom` shows `<div data-testid="empty-cart"><p>Your cart is empty</p></div>`, and the header cart button has no badge.

## A search that matches nothing shows no message

**Type:** bug. Test: `search.cy.js` › "shows "No emojis found" when nothing matches" (`r14`, test plan Q8).

Requirement: "A search that matches no emoji shows the message 'No emojis found'."

Evidence: typing `xyzzy` passed (`to have value xyzzy`), then:

```text
Timed out retrying after 4000ms: Expected to find content: 'No emojis found' but never did.
```

`dom` on `main` shows the search box followed by an empty grid, `<div class="mt-8 grid …"></div>`, and nothing else. A shopper sees a blank page under the search box.

## The checkout completes a purchase with invalid payment details

**Type:** bug. Tests: `checkout.cy.js` › "does not complete the purchase with …, and says what is wrong next to the field" (test plan K5–K9).

Requirement: "The card number must have 16 digits; spaces between groups of digits are allowed. The expiry date must be in the format MM/YY and must not be in the past. The CVV must have 3 digits. When one of them is not valid, the purchase is not completed, and a message next to that field says what is wrong."

| Test | Invalid value | Field |
| --- | --- | --- |
| `r10` | `1234 5678 9012` (12 digits) | Card Number |
| `r11` | `1230` (not MM/YY) | Expiry Date |
| `r12` | `01/20` (in the past) | Expiry Date |
| `r13` | `12` (2 digits) | CVV |

Evidence: in all four, every field was typed (each `have value` passed) and the click on "Complete Purchase" passed. Each then failed on the first assertion that states the requirement:

```text
Timed out retrying after 4000ms: Expected to find content: 'Payment Information' within the selector: 'h3' but never did.
```

Pinned at that row (command 27, `r10` and `r13`), `aria` shows `heading  Thank You for Your Purchase!` and `button  Back to Store`: the purchase went through. The inputs have no `pattern` or `maxlength` (feature map), so the only check is `required`. Whether a message would appear next to the field is not reached, because the form is gone.

## The checkout hides the cart button and the search box

**Type:** design choice. No requirement covers it.

The checkout header shows only "EmojiMart" (feature map, view 4). The requirements only say that "← Back to store" returns to the store with the cart as it was, which passes (`checkout.cy.js`, `r17`).

## The confirmation page hides the header and the search box

**Type:** design choice. No requirement covers it.

`dom` on the confirmation page (`checkout.cy.js`, `r19`, pinned at command 28) shows only the check icon, the heading, the paragraph, the order number, and "Back to Store", with no `header`. The requirement for that page ("A completed purchase shows a page with the heading 'Thank You for Your Purchase!'") says nothing about the header.

## An empty cart has no "Proceed to Checkout" button

**Type:** design choice. Allowed by "From a cart that is not empty, 'Proceed to Checkout' opens the checkout.", which only asks for the button when the cart has items.

The empty cart shows `[data-testid="empty-cart"]` and no total and no checkout button (feature map, view 3). So the checkout cannot be reached with an empty cart.

## An empty cart shows no badge on the cart icon

**Type:** design choice. Allowed by "The cart icon at the top of the store shows how many units the cart holds", which does not say how an empty cart is shown.

After a reload or a purchase, `dom` on `header button` shows the icon and no `span` badge. With units, the badge shows the count (`have text '1'`, `'3'`, `'10'` passed in `cart.cy.js`).

## Every view is on the same URL

**Type:** design choice. No requirement covers it.

The URL stays `/` in the store, an emoji's page, the cart, the checkout, and the confirmation (feature map). One consequence is that a view cannot be bookmarked or shared, and a reload always goes back to the store.

## The search box stays on an emoji's page

**Type:** design choice. No requirement covers it.

The search box is on screen on the Rocket's page (feature map, view 2). Typing there was not tried, and no requirement says what it should do.

## The search box is named only by its placeholder

**Type:** design choice. Allowed by "The store has a search box with the placeholder "Search emojis..."", which asks for a placeholder and no label.

`inspect` on `input[placeholder="Search emojis..."]` shows `role textbox`, `name Search emojis...`, and `dom` shows no `<label>` and no `aria-label`. The name comes from the placeholder alone.

## The checkout form has no name and no autocomplete

**Type:** design choice. Allowed by "The checkout asks for contact information (Email and Full Name), a shipping address (Street Address, City, and Country), and payment information (Card Number, Expiry Date, and CVV).", which lists the fields only.

`aria` shows a bare `form`. `dom` shows every input with `id`, `name`, `type`, and `required`, and none with `autocomplete`. Every field does have a name, from its `<label for>`: `textbox  Email  [required]` through `textbox  CVV  [required]`.

## The remove button is 20 × 20 px

**Type:** design choice. No requirement covers it.

`inspect` on `button:has(.lucide-trash2)` in the cart (`r5`, command 15) gives `width 20 height 20`. The cart's close button and the header cart button are 40 × 40. Minus and plus were not measured.

## Is a confirmation email really sent?

**Type:** question.

Seen: the confirmation page says "Your order has been successfully placed. We've sent a confirmation email with your order details." (`dom`, `checkout.cy.js`, `r19`, pinned at command 28). The Command Log of that purchase has no network row, and the app makes no request after it loads.

Why the browser cannot settle it: an email would be sent by a server, which Cypress Tap cannot see. No request leaving the page suggests nothing is sent, but cannot prove the app is not meant to be a demo. No requirement mentions an email.

Ask: "Should the confirmation page promise an email? If no email is sent, should the text change?"

## When is an expiry date in the past?

**Type:** question.

Seen: the app accepts any expiry date, including `01/20` (see the payment bug above), so its behavior gives no hint.

Why the browser cannot settle it: the requirement says the expiry date "must not be in the past", and an MM/YY date names a whole month. Whether the current month (10/26 today) is still valid, and against which time zone, is a decision, not something the page shows.

Ask: "Is a card that expires in the current month accepted until the end of that month? Whose clock decides the month?"

## Which card number formats are allowed?

**Type:** question.

Seen: the Card Number placeholder is `1234 5678 9012 3456` (feature map), and the app accepts any value.

Why the browser cannot settle it: the requirement says "16 digits; spaces between groups of digits are allowed", but not how the groups are split, nor whether other separators (such as dashes) or leading and trailing spaces are allowed. With no validation in the app, there is no behavior to read.

Ask: "Must the groups be 4-4-4-4, or are any spaces allowed? Are dashes allowed?"

## Should an emoji's page open from the keyboard?

**Type:** question.

Seen: what opens an emoji's page is a `<div class="cursor-pointer">` around the symbol, the `h3`, and the description (`dom`, store, `r5`, command 2). It has no role and no `tabindex`, and `inspect` on it has no accessibility section. `aria` shows each card as only a heading and a button, with nothing that opens the page:

```text
heading  Rocket
button  Add to Cart
  image
```

There is no `link` anywhere in the app. Clicking works: `explore.cy.js` › "opens the Rocket" (`r3`) clicks the `h3` and reaches the page, which meets "Clicking an emoji's symbol, name, or description opens its page". The accessibility requirement covers buttons, and this is not a button.

Why the browser cannot settle it: the requirements only talk about clicking. Tap read markup and snapshots and never pressed Tab or Enter. Whether keyboard and screen reader users must be able to open the page is for the team to decide.

Ask: "Must an emoji's page open from the keyboard and be announced to a screen reader? If so, as a link or as a button, and with what name?"

## How should a screen reader announce an emoji's symbol?

**Type:** question.

Seen: the symbol is plain text in a generic element: `<div class="text-6xl …">🚀</div>` on the card, `<div class="text-9xl …">` on the emoji's page, `<span class="text-4xl">🚀</span>` in the cart line. None has `role="img"` or `aria-label`. `aria --selector '[data-testid="emoji-card"] .text-6xl' --at 1` returns `No accessibility nodes found.` and `inspect` gives `role generic`. On the Rocket's page (`r3`, command 8), the tree goes straight from the back button to the heading:

```text
button  ← Back to all emojis
heading  Rocket
button  Add to Cart
```

Why the browser cannot settle it: `aria` leaves out static text, so it does not show what a screen reader says. Each reader may read the Unicode name ("rocket") or skip the symbol. The requirements say the card and the page show the symbol, which they do on screen, but nothing about announcing it.

Ask: "Should the symbol be announced, for example as an image named after the emoji, or hidden, since the name comes right after it? Should the cart line work the same way?"

## Should the cart behave as a dialog?

**Type:** question.

Seen: the open cart (`r5`, command 15) is an overlay, `div.fixed.inset-0 … z-50`, with a side panel, and `inspect` gives both `role generic`. `inspect --selector '[role="dialog"], dialog, [aria-modal]'` returns `not found`, and nothing ties the panel to its title, "Your Cart". With the cart open, `aria` still shows the store's whole `main`, with the six "Add to Cart" buttons, and lists the cart after it, outside any landmark:

```text
main
  …
  heading  Glowing Star
  button  Add to Cart
heading  Your Cart
button
…
```

Why the browser cannot settle it: snapshots are static, so Tap does not show where focus goes when the cart opens, whether it stays inside the cart, whether Escape or a click on the overlay closes it, or where focus returns afterwards. The requirements only say "The cart icon opens the cart, titled "Your Cart"" and "The cart can be closed without changing its contents".

Ask: "Should the cart be a modal dialog (`role="dialog"`, `aria-modal`, named by "Your Cart", focus moved into it and back when it closes, closed with Escape)? Or a side panel that leaves the page behind it usable?"

## Should the icons be hidden from screen readers?

**Type:** question.

Seen: `aria` shows every icon as a bare `image`: inside each "Add to Cart", in the header cart button, the search box's magnifier, and the cart's close, minus, plus, and remove buttons. `dom` shows them as `svg.lucide-*` with no `aria-hidden` and no name. In the store (`r5`, command 2):

```text
button  Add to Cart
  image
```

A named button keeps its name ("Add to Cart"). In the icon-only buttons (see the first finding), the unnamed image is all there is.

Why the browser cannot settle it: the tree shows that the icons are exposed, not what a screen reader does with an unnamed image. Some readers skip it and others announce "image" or "graphic". The accessibility requirement asks for a name on every button and says nothing about images, so whether the icons are decoration or content is for the team to decide.

Ask: "Are the icons decorative, to be hidden with `aria-hidden="true"`? Or should any of them carry a name of its own, for example the magnifier next to the search box?"

## Should the headings skip a level?

**Type:** question.

Seen: `dom` shows `h1` "EmojiMart" followed by an `h3` per card in the store, and by the `h3` sections ("Contact Information", "Shipping Address", "Payment Information") in the checkout, with no `h2` in between. The Rocket's page and the cart use `h2`. `aria` shows `heading` without its level, so the levels come from `dom`.

Why the browser cannot settle it: the browser shows the levels but not whether they are intended. Screen reader users move through a page by heading level, and a jump from `h1` to `h3` can read as a missing section. No requirement says what the outline should be.

Ask: "Should the cards and the checkout sections be `h2`, or is there a level 2 heading meant to sit above them, such as a title for the emoji list?"

## Not triaged yet

- **An invalid email address.** Requirement: "The email must be a valid email address." `#email` is `type="email"`, so the browser probably blocks the submit, but no invalid email was ever submitted and no test covers it. The browser can settle it; it needs a test before it gets a type.

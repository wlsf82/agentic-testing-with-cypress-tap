# Emoji Mart: requirements

Emoji Mart is an online store that sells emojis. This document says what the store should do. It is written for the people who build and test it.

## The store

- The store is called EmojiMart, and its name is shown at the top of the page.
- The store sells six emojis. Each one has a symbol, a name, a short description, and a price in US dollars:

  | Emoji | Price |
  | --- | --- |
  | Smiling Face | $4.99 |
  | Rocket | $6.99 |
  | Rainbow | $5.99 |
  | Sparkling Heart | $3.99 |
  | Game Controller | $7.99 |
  | Glowing Star | $4.99 |

- The store shows every emoji as a card with its symbol, name, description, and price, and an "Add to Cart" button.
- Prices are shown with a dollar sign and two decimal places, such as $4.99.

## Search

- The store has a search box with the placeholder "Search emojis...".
- A search matches an emoji's name or its description, ignoring upper and lower case.
- While a search is active, the store shows only the emojis that match it.
- Clearing the search shows every emoji again.
- A search that matches no emoji shows the message "No emojis found".

## An emoji's page

- Clicking an emoji's symbol, name, or description opens its page, which shows its symbol, name, description, and price.
- An emoji's page has an "Add to Cart" button, which adds the emoji to the cart.
- An emoji's page has a "← Back to all emojis" button, which returns to the store.

## Cart

- "Add to Cart" adds one unit of that emoji to the cart. Adding an emoji that is already in the cart increases its quantity instead of adding a second line.
- The cart icon at the top of the store shows how many units the cart holds, counting each unit of each emoji.
- The cart icon opens the cart, titled "Your Cart".
- Each line of the cart shows the emoji, its price, and its quantity.
- Pressing plus on a line adds one unit of that emoji.
- Pressing minus on a line takes one unit away.
- Pressing minus on an item whose quantity is 1 removes the item from the cart.
- Each line has a remove button, which takes the whole line out of the cart.
- The cart shows its total, labelled "Total:", as the sum of each line's price times its quantity.
- An empty cart shows the message "Your cart is empty".
- The cart can be closed without changing its contents.
- The cart keeps its contents when the page is reloaded.

## Checkout

- From a cart that is not empty, "Proceed to Checkout" opens the checkout.
- The checkout asks for contact information (Email and Full Name), a shipping address (Street Address, City, and Country), and payment information (Card Number, Expiry Date, and CVV).
- Every field is required.
- The email must be a valid email address.
- The card number must have 16 digits; spaces between groups of digits are allowed. The expiry date must be in the format MM/YY and must not be in the past. The CVV must have 3 digits. When one of them is not valid, the purchase is not completed, and a message next to that field says what is wrong.
- The checkout shows the cart's total, labelled "Total Amount:".
- "← Back to store" returns to the store, with the cart as it was.
- "Complete Purchase" completes the purchase when every field is valid.

## After a purchase

- A completed purchase shows a page with the heading "Thank You for Your Purchase!".
- That page shows an order number made of uppercase letters and digits.
- After a purchase, the cart is empty.
- "Back to Store" returns to the store.

## Accessibility

- Every button has an accessible name that says what it does: a screen reader announces the cart button as "Open cart", the remove button of the Rocket's line as "Remove Rocket", and so on.

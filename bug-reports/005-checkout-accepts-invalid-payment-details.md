# The checkout completes a purchase with an invalid card number, expiry date, or CVV

## Environment

- App: Emoji Mart, <https://emoji-mart-one.vercel.app>
- Browser: Chrome 155.0.8059.80 (Official Build) (arm64), driven by Cypress 16.2.0 (`cypress open --e2e --browser chrome`), read with Cypress Tap
- Date: 2026-10-17

## Requirement

> The card number must have 16 digits; spaces between groups of digits are allowed. The expiry date must be in the format MM/YY and must not be in the past. The CVV must have 3 digits. When one of them is not valid, the purchase is not completed, and a message next to that field says what is wrong.

(`docs/requirements.md`; test plan K5–K9)

## Preconditions

- The store is open at `/`.
- The cart holds one Rocket.
- The checkout is open (cart → "Proceed to Checkout").

## Steps to reproduce

1. Fill in every field with these valid values, except one, which gets an invalid value from the table below:

   | Field | Valid value |
   | --- | --- |
   | Email | `shopper@example.com` |
   | Full Name | `Test Shopper` |
   | Street Address | `123 Test Street` |
   | City | `Testville` |
   | Country | `Testland` |
   | Card Number | `1234 5678 9012 3456` |
   | Expiry Date | `12/30` |
   | CVV | `123` |

2. Click "Complete Purchase".

Invalid values, one per run:

| Case | Field | Invalid value | Why it is invalid |
| --- | --- | --- | --- |
| 1 | Card Number | `1234 5678 9012` | 12 digits, not 16 |
| 2 | Expiry Date | `1230` | Not in the format MM/YY |
| 3 | Expiry Date | `01/20` | In the past |
| 4 | CVV | `12` | 2 digits, not 3 |

## Expected result

The purchase is not completed: the checkout form stays on screen, and a message next to the invalid field says what is wrong.

## Actual result

In all four cases, the purchase is completed. The page shows "Thank You for Your Purchase!" and a "Back to Store" button.

The payment inputs have no `pattern` or `maxlength`, so the only check is that each field is filled in. Whether a message would appear next to the field was not reached, because the form is gone.

## Evidence

Skipped tests that reproduce the bug: `cypress/e2e/checkout.cy.js` › Validation › "does not complete the purchase with …, and says what is wrong next to the field", one per case:

| Case | Test | Full title |
| --- | --- | --- |
| 1 | `r10` | "… with a card number without 16 digits, …" |
| 2 | `r11` | "… with an expiry date not in the format MM/YY, …" |
| 3 | `r12` | "… with an expiry date in the past, …" |
| 4 | `r13` | "… with a CVV without 3 digits, …" |

Fresh verdict on 2026-10-17, run `startedAt` 2026-10-17T19:01:52.556Z. In all four, every field was typed (each `have value` passed) and the click on "Complete Purchase" passed. Each then failed on the first assertion that states the requirement:

```text
Timed out retrying after 4000ms: Expected to find content: 'Payment Information' within the selector: 'h3' but never did.
```

Pinned at that row (command 27, cases 1 and 4), `aria` shows `heading  Thank You for Your Purchase!` and `button  Back to Store`: the purchase went through.

## Severity

**Critical.** The store takes orders with payment details that cannot be valid, and the shopper is told the purchase succeeded.

## Priority

**High.** Every purchase goes through this form. Orders with bad payment details either fail later, out of the shopper's sight, or have to be caught by hand.

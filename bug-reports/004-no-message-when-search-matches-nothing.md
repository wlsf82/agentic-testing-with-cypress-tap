# A search that matches nothing shows no "No emojis found" message

## Environment

- App: Emoji Mart, <https://emoji-mart-one.vercel.app>
- Browser: Chrome 155.0.8059.80 (Official Build) (arm64), driven by Cypress 16.2.0 (`cypress open --e2e --browser chrome`), read with Cypress Tap
- Date: 2026-10-17

## Requirement

> A search that matches no emoji shows the message 'No emojis found'.

(`docs/requirements.md`; test plan Q8)

## Preconditions

- The store is open at `/`, with every emoji on screen and the search box empty.

## Steps to reproduce

1. Type `xyzzy` in the search box ("Search emojis...").

## Expected result

The store shows the message "No emojis found".

## Actual result

The store shows no emojis and no message. Under the search box there is only an empty grid. The shopper sees a blank page and cannot tell if the search failed or the page is still loading.

## Evidence

Skipped test that reproduces the bug: `cypress/e2e/search.cy.js` › Results › "shows "No emojis found" when nothing matches" (`r14`).

Fresh verdict on 2026-10-17, run `startedAt` 2026-10-17T19:01:32.440Z. Typing passed (`to have value xyzzy`), then the test failed on the assertion that states the requirement:

```text
Timed out retrying after 4000ms: Expected to find content: 'No emojis found' but never did.
```

`dom` on `main` shows the search box followed by an empty grid, `<div class="mt-8 grid …"></div>`, and nothing else.

## Severity

**Minor.** Nothing is lost or wrong, but the shopper gets no feedback.

## Priority

**Low.** It only shows up with a search that matches nothing, and clearing the search brings every emoji back.

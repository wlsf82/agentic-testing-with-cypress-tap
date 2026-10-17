# Writing Tests with Cypress Tap

> **Part of:** [Cypress Instructions](./cypress.md)

This guide covers how to write and verify Cypress tests against the real app using Cypress Tap (`npx cypress tap <command>`), which drives an already running `cypress open` session from the command line. It lets you read the app under test (accessibility tree, DOM, attributes), run specs, and read results and the Command Log without interacting with the Cypress window.

## Prerequisites

- Cypress **15.21.0+** (check `package-lock.json`, not `tap --help`)
- `npm run cy:open` is running, in Chrome. Tap only works in Chromium-based browsers (Chrome, Chromium, Edge, and Electron); Firefox and WebKit are not supported
- Commands are run from the project root, so `npx` picks the project's Cypress binary and session
- Nobody touches the Cypress window while Tap drives it. The terminal and the window share one browser frame, with no lock between them

Confirm the session before anything else:

```bash
npx cypress tap sessions   # one row per session: pid, project, testing type, browser
npx cypress tap status     # lifecycle stage, selected spec, counts
npx cypress tap specs      # runnable spec paths
```

> If more than one session is listed, pass `--session <pid>` on every command.

## The Workflow

1. **Arrange the page state** with a minimal spec
2. **Read the real app** with `aria`, `dom`, and `inspect` to pick selectors and expected texts
3. **Write the test**: act and assert
4. **Wait for a fresh verdict**
5. **Read the results** and the Command Log
6. **Refine the assertions** using what the app actually shows

### 1. Arrange the page state

Tap can only read the app after a spec has taken it somewhere. Start with a spec that just gets to the state you need:

```js
describe('Exploring Emoji Mart', () => {
  it('opens the store', () => {
    cy.visit('/')
  })
})
```

Every view is at `/`, so a state other than the store is reached by extending the spec through the UI, never by visiting another URL.

### 2. Read the real app

```bash
npx cypress tap aria                                              # roles, accessible names, control states and values
npx cypress tap dom --selector '[data-testid="emoji-card"]' --at 1  # exact markup, attributes, and text
npx cypress tap inspect --selector '[data-testid="emoji-card"]' --at 1
```

- Use `aria` first to see what's on the page and how it's labeled. A `button` with nothing after it has no accessible name
- Use `dom` for exact texts and attributes such as `data-testid`, `id`, `type`, and `placeholder`
- Use a deliberately broad selector to discover what is on the page: an ambiguous match exits `1` and lists the candidates
- When `dom`, `aria`, or `inspect` matches many elements (`[data-testid="emoji-card"]` matches six), pick one of the listed candidates with `--at <index>`, which is **0-based** here
- Large pages can be cut down with a selector, or with `--max-chars` (`dom`) and `--max-nodes` (`aria`)

Then pick selectors following the [selector priority](./03-selectors.md).

#### Verify against what `cypress tap` shows

There is no source code to check a selector or a text against. A selector or a text is real only when it appears in `aria` or `dom` output read on that state. That holds for specs and, above all, for custom commands, where a wrong selector breaks every test that uses them.

#### Know where validation happens

The checkout leaves part of its validation to the browser: `required` and `type="email"` in the markup, enforced by a bubble on submit that is not part of the page, so `dom` and `aria` never show it. Read the attributes with `dom`, and assert them rather than the browser's behavior (see [Assertions](./05-assertions.md)).

### 3. Write the test

Write it following the [AAA pattern](./02-test-organization.md) and the [test data rule](./06-code-quality.md). Saving the **selected** spec (the one `status` shows) triggers Cypress's file watcher, which runs it, so there's no need to dispatch a run after editing.

> The watcher only reruns the **selected** spec. Saving a different spec doesn't run it, so dispatch it with `npx cypress tap run <spec>`.

### 4. Wait for a fresh verdict

`run` (and the watcher) only dispatches a run, and returns before the spec has started. Until the new run starts, `status` still shows the **previous** run's verdict. To avoid trusting a stale result:

1. Note the current `startedAt` from `npx cypress tap status --json` **before** saving or running. Not afterwards: by then the new run may have started, and the polling would wait for a run that already happened
2. Poll `status --json`, one call at a time, about every 2 seconds
3. Accept only `passed` or `failed` for the expected `spec`, with a `startedAt` different from the one noted
4. Stop polling after a bounded number of attempts, and stop at once if `status` exits with `1`

A `passed` counts only when `results.passed` is greater than zero and equal to the number of tests the spec should run.

Below is a reusable polling snippet, in Bash (set `spec` to the expected spec path, as `tap specs` lists it, and replace the value of `base` with the noted `startedAt`, or leave it as `null` before the very first run).

```bash
spec="cypress/e2e/<name>.cy.js"
base="null"
verdict=""
for i in $(seq 1 60); do
  out=$(npx cypress tap status --json 2>/dev/null) || { echo "status failed"; break; }
  s=$(echo "$out" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{const j=JSON.parse(d);console.log(j.status+"|"+j.startedAt+"|"+j.spec)}catch{console.log("?|?|?")}})')
  st=${s%%|*}; rest=${s#*|}; sa=${rest%%|*}; sp=${rest#*|}
  if { [ "$st" = passed ] || [ "$st" = failed ]; } && [ "$sa" != null ] && [ "$sa" != undefined ] && [ "$sa" != "?" ] && [ "$sa" != "$base" ] && [ "$sp" = "$spec" ]; then
    verdict="$st $sa"; echo "$verdict"; break
  fi
  sleep 2
done
[ -n "$verdict" ] || echo "no fresh verdict (last status: $st, spec: $sp)"
```

`no fresh verdict` means there is no verdict: report it as such, never as a pass or a failure.

> **Never put two runs in flight.** If you saved the selected spec, use the watcher's run instead of also calling `npx cypress tap run <spec>`.

Saving files the spec depends on (e.g., `cypress/support/commands.js` or `cypress.config.js`) also triggers runs, and several quick edits may trigger several runs. After a batch of edits, wait for the watcher's runs to finish, then dispatch a single `npx cypress tap run <spec>` to get a verdict that reflects the final state of every file.

A JavaScript syntax error leaves the spec in `loading`, with the error shown only in the Cypress window, not through Tap. That is why the polling is bounded: when a spec never leaves `loading`, look for a syntax error.

To get the error, with its file and line, run the spec headless:

```bash
npx cypress run --browser chrome --spec <spec>
```

The bundling fails within seconds, before any test runs, and prints the error with a code frame (e.g., `Unexpected token, expected "," (4:2)`). It is a separate process, so it does not touch the open session. If it exits at once with only `code: 'MODULE_NOT_FOUND'`, the shell has `ELECTRON_RUN_AS_NODE` set (editors such as VS Code leak it): rerun it with `env -u ELECTRON_RUN_AS_NODE` in front. If you can't run it at all, ask the user to run it and send you the output, and don't guess at the error.

When the polling ends with `status` still showing another spec, the run you expected never started: check that the path you passed matches one listed by `npx cypress tap specs`, then dispatch it once more with `npx cypress tap run <spec>`.

### 5. Read the results

```bash
npx cypress tap reporter                  # overview with test ids (e.g., r3, r4)
npx cypress tap reporter --test-id r4     # full test: hooks, commands, network, errors
```

> Copy test ids from `reporter`. Don't infer them from the order of the tests.

Even when a test passes, read its Command Log and confirm:

- Each command yielded the intended element (check the assertion messages)
- There are no network rows: the app makes no requests after it loads, so a request there is worth investigating

### 6. Refine the assertions using the real app

When the run ends, the app frame stays on the last test's final state, so you can read texts to assert on:

```bash
npx cypress tap aria
```

That's how a test with no assertion on the Rocket's page got one:

```js
// Before
cy.contains('[data-testid="emoji-card"]', 'Rocket').click()
// After, using the role and text read from the app
cy.contains('[data-testid="emoji-card"]', 'Rocket').click()

cy.contains('button', '← Back to all emojis').should('be.visible')
```

#### Assert where the user ends up

The URL never changes, so it says nothing about where the user is. Assert the **view** instead: a heading, or a button only that view has.

## Reading an Earlier State with `pin`

To read the state of an earlier test or step, pin its snapshot, read it, then **always** clear the pin. Until you do, every read shows the past.

```bash
npx cypress tap pin --test-id r3 --command-id 5
npx cypress tap aria
npx cypress tap pin --clear
```

- `pin --at` picks the snapshot: `before`, `after`, or a number, which is **1-based** here, because it counts a command's snapshots, not elements (unlike `--at` on `dom`, `aria`, and `inspect`, which is 0-based)
- To read something that only appears after a click (the cart, for example), **pin the positive assertion** on it, not the click that opened it. The click's snapshot can be taken before it renders

```js
cy.contains('h2', 'Your Cart').should('be.visible') // Pin this row, not the click before it.
```

## Diagnosing Failures

Read the failed test with `reporter --test-id` **before** anything reruns it, since a rerun replaces the results.

```bash
npx cypress tap reporter --test-id r3
```

**No fix without the Tap output that proves the cause.** Read the failing row and its error, then the state with `pin` and `aria` or `dom`, and change the spec only once that output shows why it failed.

While fixing a failing test, add `.only` to it, so each rerun runs just that test instead of the whole spec. Once it passes, remove the `.only`, run the whole spec to check everything still works, and make sure no `.only` was left behind:

```bash
grep -rn "\.only" cypress/e2e
```

## Confirming a Bug Before Skipping Its Test

A test that asserts a requirement the app breaks fails on purpose. Once the failure is triaged as a bug, confirm it before skipping the test:

1. Run the test alone, with `.only`
2. Read it with `npx cypress tap reporter --test-id <id>`. Every row before the failing one passed, and the failing row is the assertion that states the requirement, not something unrelated before it
3. Read the error message. It should say, in Cypress's words, what the bug says in yours

Then remove the `.only` and switch the test to `it.skip`, with a three-line comment above it: the bug, where it is reported, and when to remove the skip.

```js
// Bug: <what is wrong, in one line>.
// Reported in bug-reports/<NNN>-<short-title>.md.
// Remove the .skip once the bug is fixed.
```

A confirmed bug's test is never deleted (that throws away the proof) and never left failing (a suite that is always red stops being read).

## Quick Command Reference

| Command | Use it to |
| --- | --- |
| `sessions` | List reachable sessions (pid, project, testing type, browser) |
| `status --json` | Get the lifecycle stage, `spec`, `startedAt`, `totalTests`, and `results` |
| `specs` | List runnable spec paths |
| `run <spec>` | Dispatch a spec (returns before it runs) |
| `reporter` | Get the spec overview and test ids |
| `reporter --test-id <id>` | Read one test's hooks, commands, network, and errors |
| `command --test-id <id> --command-id <n>` | Read one command row in detail |
| `aria` / `dom` / `inspect` | Read the app (accessibility tree / markup / one element) |
| `dom` / `aria` / `inspect --at <index>` | Pick one of the candidates of an ambiguous selector (0-based) |
| `pin` / `pin --clear` | Rewind the app to a command snapshot / return to the live app |

> Large JSON outputs (`reporter --test-id --json`, `command --json`) can be hundreds of kilobytes. Save them to a file before parsing.

## See Also

- [Test Organization](./02-test-organization.md) - AAA pattern and hooks
- [Selectors](./03-selectors.md) - Choosing selectors found while reading the app
- [Commands](./04-commands.md) - Retry-ability and custom commands
- [Assertions](./05-assertions.md) - Asserting the requirement

## Failure catalog

Each entry is a failure an agent actually hit on this project, written as a symptom, a cause, and a fix, so the next session recognizes it. Entries are added when they happen, never in advance.

### The cart holds a different emoji than the one the test added

- **Symptom:** `cy.contains('[data-testid="cart-item"]', '<name>')` times out. Pinning the open cart and reading it with `dom` shows another emoji (the first card, Smiling Face). `command` on the "Add to Cart" row shows `Applied To <body>`.
- **Cause:** `cy.contains('button', 'Add to Cart')` written as a separate command searches the whole page and yields the first of the six "Add to Cart" buttons. A `cy.contains` on the card just before it does not limit it.
- **Fix:** use `cy.addToCart('<name>')`, which limits the click to the card and checks the cart count, instead of clicking the button inline. See [Custom Commands](./04-commands.md#custom-commands) and [Selectors](./03-selectors.md).

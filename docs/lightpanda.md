# Lightpanda E2E Browser

> ⭐ Featured in [awesome-lightpanda](https://github.com/lightpanda-io/awesome-lightpanda#ai-agents-and-automation) — a curated list of things built with Lightpanda.

All Playwright suites (acceptance, smoke, and regression) run against a local [Lightpanda](https://lightpanda.io/) browser over the Chrome DevTools Protocol (CDP) instead of launching Chromium.

## How it's wired

- The [`@lightpanda/browser`](https://www.npmjs.com/package/@lightpanda/browser) npm package manages the binary and exposes a programmatic API.
- Global setup (`e2e/fixtures/globalSetup.ts`) calls `startLightpanda()`, which spawns the CDP server with `lightpanda.serve({ host: '127.0.0.1', port: 9222 })` and polls `http://127.0.0.1:9222/json/version` until it responds.
- The `browser` fixture (`e2e/fixtures/test.ts`) connects Playwright with `chromium.connectOverCDP('ws://127.0.0.1:9222')`.
- Global teardown (`e2e/fixtures/globalTeardown.ts`) stops the server process.

## Setup

Download the Lightpanda binary before running e2e tests for the first time:

```bash
npx lightpanda install
```

The binary is cached at `~/.cache/lightpanda-node/lightpanda`. To upgrade to the latest nightly, run `npx lightpanda upgrade`.

If you want to use your own binary instead, point the `LIGHTPANDA_EXECUTABLE_PATH` environment variable at it and skip the install step entirely.

## What we had to change

Running a real-world Playwright suite against Lightpanda instead of Chromium surfaced a handful of compatibility gaps. Most have since been fixed upstream — this section documents the full journey, because the current state of a test suite only makes sense with that history.

### Still required

- **Disabled-button clicks time out instead of rejecting.** Playwright's actionability checks reject immediately against a disabled button in Chromium; Lightpanda waits for the button to become enabled and eventually times out. `DpsCalcPage.clearForm()` guards the click with an `isDisabled()` check and skips it — which also matches real user behavior, since a disabled button can't be activated anyway.

### Fixed upstream (workarounds removed)

- **Manual `change` events on `<select>` elements.** `selectOption` didn't reliably fire `change`, so page objects dispatched a synthetic event after every selection. Lightpanda now fires it, and the dispatches are gone.
- **DOM `element.click()` for off-viewport and SVG-only buttons.** Lightpanda didn't compute a layout box for these elements, so pointer-event clicks failed and page objects clicked through the DOM node directly. Standard Playwright clicks work now.
- **`toBeAttached()` instead of `toBeVisible()`.** Visibility wasn't computed for SVG-only elements, so assertions settled for DOM presence. They've been reverted to `toBeVisible()`.

### Application-side changes

- **The DPS form dropped `HTMLFormElement.reset()`.** Lightpanda didn't implement it at the time, and since the form is fully controlled by React state the call was redundant — removing it simplified the component rather than working around the browser.

## Further reading

- [awesome-lightpanda](https://github.com/lightpanda-io/awesome-lightpanda) — community projects built with Lightpanda
- [Lightpanda browser](https://github.com/lightpanda-io/browser) — the browser itself
- [@lightpanda/browser](https://github.com/lightpanda-io/node-packages/tree/main/packages/browser) — the Node.js package used here

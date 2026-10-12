# Current verification evidence

`focused-browser.json` contains 25 named scenarios and the 245 actual assertions. The two regression reports contain 215 layout and 36 interaction assertions. They use the disclosed offline React harness, not live assistant/admin services or physical phones. The final handoff lists all limitations.

`isolated-node-tests.txt`: 82 pass. `full-supplied-tests.txt`: the broader command also hits seven import-blocked suites from the partial export. `production-build.txt`: Next is not installed. The scoped framework-independent TypeScript command passed without diagnostics; app-wide TSX/lint was not run successfully.

`build-review-preview.cjs` rebuilds the supplied source modules and CSS into a prior offline review HTML. It expects the harness’s module/asset markers and retains the missing-module fixtures listed in `preview-build.json`. Usage: `node verification/build-review-preview.cjs . previous-offline-preview.html next-preview.html`. It is not a Next build or a production asset pipeline.

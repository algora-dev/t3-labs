# Website helper verification

See `results.json` for exact scope and all browser assertions, and `unit-tests.tap` for the Node test output.

`npm test` runs the retained suite plus the new helper and isolated enquiry-route tests. The route test uses the real handler, data loader and payload builder, with only NextResponse and persistence boundaries replaced. It verifies that a demo business cannot send an email or mutate saved contact facts even when an email API key is present.

The browser run used Chromium with actual compiled components in a standalone React 18.2 harness, not the full Next.js/React 19 application. Assistant success responses were explicit test fixtures; a separate failure check confirmed the delivered preview never invents an answer. All calculations in the Quick Estimate used the existing catalogue and engine. These checks establish component behaviour, not live model reliability or production readiness.

No dependencies were installed successfully in this environment. A full project build, lint, typecheck, live assistant conversation, server PDF and calibrated-plan regression remain release gates.

# PayPal AI Hackathon submission preparation

Official rules: https://paypalaihackathon.devpost.com/rules

Rules checked October 10, 2026. Submission deadline: November 12, 2026, noon Pacific / 3 p.m. Eastern. Sandbox PayPal integration plus an AI tool satisfies the integration requirement. Live payments and separate money transfers are not required.

## Required materials

| Requirement | Current state | Remaining work |
| --- | --- | --- |
| Working PayPal + AI application | Sandbox checkout and live OpenAI planner implemented; owner-reported checks passed | Repeat the full judge walkthrough in the final build |
| Public source repository | Published at https://github.com/tmatthew937-web/Tuck-and-Grow; public visibility verified October 10, 2026 | Keep it updated with the final demonstrated build |
| Open-source license | MIT license published; third-party notices preserved | Complete |
| Working build accessible to judges | Hosted build is private | Establish free judge access and test it; provide complete access instructions |
| Written description | Draft below | Review and enter it into Devpost |
| Public YouTube demonstration under 3 minutes | Recording outline prepared below | Record, upload publicly, verify the link, and add it to Devpost |

Keep the judge build available through the end of judging, December 15, 2026. Do not put private secrets or personal account credentials into the public repository or video.

## Project description draft

### Inspiration

For a small seller, a payment notification tells only part of the story. Fees reduce what came in, some income needs to be set aside, and business and personal spending can become mixed. Tuck and Grow gives each incoming payment a clear plan.

### What it does

Tuck and Grow connects PayPal sandbox checkout to three bookkeeping buckets: tax reserve, business, and personal. A seller describes their preferred split in everyday language. The OpenAI planner turns that request into a structured suggestion and a $100 preview. The seller reviews and saves the rules. When a sandbox payment is captured, the app records its fees and applies the saved split to the remaining amount. Users can trace allocations, record expenses, and export their monthly activity as CSV.

### How it was built

The app uses React and TypeScript with Vinext, Cloudflare Workers and D1, PayPal Orders API sandbox creation/capture, and the OpenAI Responses API. Allocation calculations use integer cents. AI output is validated on the server, and AI suggestions cannot save rules or make payments. Connections are encrypted server-side and scoped to the signed-in user.

### Challenges

The difficult parts were distinguishing percentages of the total from percentages of the remainder, preserving exact cents, recording captures without duplicate allocations, and making connection failures understandable. The planner asks for clarification when a request cannot be safely expressed by the supported rules.

### Accomplishments

The prototype links a working AI plan to a real sandbox checkout flow and persistent, traceable allocations. The owner has tested two distinct split calculations, checkout, spending, saved data after refresh, and monthly totals.

### What we learned

Payment budgeting needs clear boundaries: an earmarked amount is not a separate wallet, and a recorded expense is not a payment instruction. Keeping AI suggestions separate from deterministic calculations and user-approved saves makes the behavior easier to inspect.

### What's next

This contest build focuses on sandbox payments captured by the app. Future work could extend transaction synchronization. The submitted version does not claim to move real money, calculate taxes owed, or manage separate PayPal wallets.

## Demo recording outline: target 2 minutes 40 seconds

| Time | Screen | Explain |
| --- | --- | --- |
| 0:00–0:20 | Overview | A small seller needs a plan for income after payment fees. Introduce the three allocation buckets. |
| 0:20–0:55 | Money planner | Type the 20% reserve / equal remainder request. Show the $20/$40/$40 preview and explicitly save it. |
| 0:55–1:45 | Sandbox checkout, then Activity | Complete a sandbox buyer payment. Show the captured payment, fee, and allocations. State that only test money is involved. |
| 1:45–2:10 | Personal bucket / Record spending | Record a $5 expense and show the new personal allocation balance. |
| 2:10–2:30 | Monthly review | Show totals and export CSV. |
| 2:30–2:40 | Overview | Explain that buckets are bookkeeping earmarks and recap the value to small sellers. |

Record the actual app working. Configure connections before recording and keep secrets off screen. Do not use copyrighted music or unrelated trademarks. Capture a complete working sandbox payment rather than substituting a practice record. Keep the final public YouTube video below three minutes.

# Tuck and Grow

A private budgeting prototype for organizing incoming PayPal sandbox payments into tax, business, and personal earmarks.

## PayPal AI Hackathon

The contest build uses PayPal's sandbox and the OpenAI Responses API. Live payments and transfers are outside this build's scope. See [judge walkthrough](docs/JUDGING.md), [local setup](docs/LOCAL_SETUP.md), and [submission preparation](docs/SUBMISSION.md) for demonstrations, access requirements, and remaining submission work. Application code is licensed under [MIT](LICENSE); bundled third-party notices remain applicable.

## What works

- Private user-owned D1 budgeting data, saved split rules, and bucket names/goals.
- Practice payments, recorded expenses, and fee-free practice refunds.
- Traceable bucket entries and monthly CSV exports.
- An encrypted connection form for sandbox Merchant credentials.
- Server-side PayPal sandbox order creation and capture; idempotent payment recording.

Buckets are bookkeeping earmarks. This prototype does not create separate PayPal wallets, move money to Savings Goals, monitor all PayPal activity, or prevent spending of underlying funds. The personal balance is an allocation based on recorded activity, not a verified full-account safe-to-spend balance.

The AI money planner accepts a plain-language split, validates a structured suggestion, and previews a $100 allocation. It asks for clarification instead of saving ambiguous requests. Users explicitly save the suggestion, with protection against overwriting newer saved rules. Live AI requires an OpenAI connection; the interface reports its setup status honestly. This is an initial prototype and is not yet the complete hackathon entry.

## Development

Node 22.13+ is required. The project uses pnpm. Install dependencies with the configured Sites installation workflow, generate schema changes with `pnpm db:generate`, and build with `pnpm build`. Run the money-allocation checks with `node --experimental-strip-types --test tests/budget.test.mjs`.

Sites provisions the D1 binding declared as `DB` in `.openai/hosting.json` and applies the generated migrations. Browser authentication is provided by Sites/ChatGPT and every budgeting API requires the authenticated user's identity.

Configure `CONNECTION_ENCRYPTION_KEY` as a secret containing 64 lowercase hexadecimal characters. Preserve this key across deployments to keep saved connections readable. Sandbox Client ID and Client Secret are entered in the private app connection form, encrypted using AES-GCM with the user ID bound as associated data, and stored server-side. Credentials are never returned by the budgeting APIs.

## Sandbox walkthrough

1. Open My rules, choose Connect PayPal sandbox, and enter the Merchant app's sandbox credentials.
2. Save your reserve and remainder split.
3. Select PayPal sandbox in the Viewing control.
4. Start sandbox checkout, log in as a separate test buyer, and approve the payment.
5. Return to the app to capture and record the payment. Inspect each bucket and the activity details.

The current sandbox demo allocates payments captured by this app. It does not yet subscribe to payment/refund webhooks. Private Sites need a deliberate externally accessible, verified webhook integration before that feature can be added. PayPal refunds are not enabled here; the practice refund action only alters pretend-money records.

Tax reserve percentages are user-selected budget rules. They are not calculations of taxes owed. Actual tax payments and a parent-managed learning mode are later features.

## AI planner

The authenticated `/api/ai/plan` endpoint calls the OpenAI Responses API with a strict JSON schema. Only the user's description and saved percentages are sent; no PayPal credentials, identities, or transaction history are included. Responses use `store: false`. Percentages are checked on the server and preview amounts are computed in integer cents. The planner cannot save rules or make payments.

Users create their own key through OpenAI Developers secure setup, then enter it in My rules → Connect OpenAI. The connection makes one small paid Responses test, and saves the key only after a valid response. Keys are encrypted server-side with AES-GCM using `CONNECTION_ENCRYPTION_KEY`, bound to the user and OpenAI connection purpose, and stored in the user-owned `ai_connections` table. Keys are never returned to clients. The planner uses only that authenticated user’s key; there is no shared account-wide API key. Optional `OPENAI_MODEL` defaults to `gpt-5.4-mini`. No API key should be committed or pasted into chat. Until connected, the suggest action stays disabled while manual rules work. API requests can incur OpenAI usage charges.

Run `node --experimental-strip-types --test tests/ai-planner.test.mjs` for offline mocked-provider checks. These validate integration behavior, not a live-model evaluation. Live checks after connection: a clear 20/60/40 remainder request, an ambiguous split, an unsupported fourth bucket, and a saved-plan payment showing the new rule version.

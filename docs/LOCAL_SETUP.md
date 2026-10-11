# Local setup

These instructions are based on the checked-in configuration. A fresh-clone end-to-end run remains to be verified. Hosted authentication and local development authentication differ; use the development server on localhost for this walkthrough.

## Prerequisites

- Node.js 22.13 or newer and pnpm matching `package.json` (11.25.0).
- PayPal developer access, a sandbox Merchant REST app, and a separate sandbox Personal buyer.
- An OpenAI key with Responses access and sufficient API credits for AI testing.

## Install and initialize local data

```sh
pnpm install --frozen-lockfile
pnpm exec wrangler d1 execute DB --local --config wrangler.local.jsonc --file drizzle/0000_known_lucky_pierre.sql
pnpm exec wrangler d1 execute DB --local --config wrangler.local.jsonc --file drizzle/0001_vengeful_peter_parker.sql
pnpm exec wrangler d1 execute DB --local --config wrangler.local.jsonc --file drizzle/0002_opposite_krista_starr.sql
```

Run each migration once against a new local database. Keep the default `.wrangler/state` persistence location: the local Wrangler configuration and Vite use the same database name and placeholder database ID. These commands use local emulation and do not migrate the hosted database.

Create an ignored `.dev.vars` file with `CONNECTION_ENCRYPTION_KEY` set to 64 lowercase hexadecimal characters generated privately. Use a different encryption key for each installation; keep it stable so saved connections remain readable. Do not commit the file. An optional `OPENAI_MODEL` setting may override the application's default model. PayPal credentials and the OpenAI API key are entered through the app's private connection forms, not a public configuration file.

```sh
pnpm dev
```

Open the localhost URL printed by the server (normally http://localhost:5173). Use the sign-in link to create the development-only session. The portable development server emulates a local identity only on loopback. An ignored managed execution profile from another environment must not be copied into a fresh local clone. Hosted Sites continues to use its real access policy and ChatGPT identity.

Open **My rules**, configure the connections, and follow `JUDGING.md`. The PayPal implementation is sandbox-only. OpenAI requests can incur usage charges. Without an OpenAI connection, manual allocation rules remain usable, but the planner cannot produce a live AI result.

## Offline checks

```sh
node --experimental-strip-types --test tests/budget.test.mjs tests/ai-planner.test.mjs tests/secret.test.mjs
```

These checks cover allocation math, mocked AI-provider behavior, and encrypted secret isolation. They do not prove a live PayPal or OpenAI connection works.

## Production build

```sh
pnpm build
```

The build targets Cloudflare Workers. Hosted deployment requires Sites provisioned identity, a D1 binding named `DB`, applied migrations, and the runtime encryption secret. `pnpm start` alone does not provide the hosted identity gateway. The `.openai/hosting.json` project ID belongs to the existing Tuck and Grow Site; do not reuse that identity to register another deployment.

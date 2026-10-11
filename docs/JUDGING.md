# Tuck and Grow: judge walkthrough

Tuck and Grow helps small sellers earmark payment income for taxes, their business, and personal use. PayPal sandbox checkout is central to the demonstration. The OpenAI planner proposes allocation rules from plain-language instructions; the user reviews and saves them.

## Access

Hosted build: https://tuck-and-grow.tmatthew937.chatgpt.site

The hosted build currently requires ChatGPT sign-in and owner-approved access. This URL alone is not yet a complete judge-access arrangement. Before submission, provide judges a supported access path and a dedicated test setup. Do not publish private API keys, client secrets, encryption keys, or your personal account credentials. A reviewer without hosted access can use the local setup in `LOCAL_SETUP.md` with their own sandbox and OpenAI credentials; that path requires OpenAI API credits and is not a substitute for providing judges free working access.

## Demonstrate the complete flow

1. Open **My rules**. Connect a PayPal **sandbox Merchant** app and OpenAI through the private connection forms if not already connected. Use a separate sandbox Personal buyer for checkout. Never use live PayPal credentials.
2. Open the money planner. Enter: “Reserve 20% for taxes, then divide the remaining money equally between business and personal.”
3. Check the $100 preview: tax $20, business $40, personal $40. Review and explicitly save the suggestion.
4. Set **Viewing** to **PayPal sandbox**. Start sandbox checkout for a $25 “Demo shirt sale.” Complete approval in PayPal using the sandbox buyer, then return to the app.
5. Open **Activity → View** for the payment. PayPal fees are deducted before applying the rules. The bucket sum should equal the payment minus fees; the last bucket receives any one-cent rounding remainder. Actual sandbox fees may vary, so do not expect a fixed $25 allocation.
6. Check that the payment appears once. Refresh and confirm it remains saved.
7. Record $5 spending from Personal, provided that bucket has at least $5. Confirm Personal falls by $5 and the other buckets are unchanged. This records an expense; it does not send money.
8. Open **Monthly review**, select the payment month, and choose **Export CSV**. Compare payment, fee, spending, and bucket totals with Activity. Avoid exposing unrelated personal records in the demo recording.

## Additional AI checks

- “Reserve 10% for taxes, then split the rest 60% business and 40% personal.” Expected preview: $10 tax, $54 business, $36 personal.
- “Save a little more for taxes.” The planner should ask for clarification rather than invent a percentage.
- “Add a fourth vacation bucket.” The planner should explain the three-bucket limitation.

## What this build demonstrates

- Real PayPal API requests in the sandbox environment, with test money only.
- AI-generated suggestions validated server-side; final cents calculated deterministically.
- User approval before changing allocation rules.
- Persistent user-owned activity, expense records, bucket history, and monthly export.

## Limits to describe accurately

Buckets are bookkeeping earmarks. They do not create PayPal wallets or Savings Goals, transfer funds, pay taxes, or prevent spending from the underlying account. The build records payments captured by this app, not all account activity. It does not handle PayPal payment/refund webhooks or real PayPal refunds. Practice refunds only adjust practice records. Tax reserve percentages are chosen by the user, not tax calculations.

## Submission status

The owner reported successful checks of both numeric planner examples, sandbox checkout, a $5 expense, persistence after refresh, and monthly totals on October 6, 2026. Those are owner-reported UI checks. The public source repository and MIT license were published and verified on October 10, 2026: https://github.com/tmatthew937-web/Tuck-and-Grow. A judge-access session, fresh-clone local run, and exported CSV review remain to be verified before submission.

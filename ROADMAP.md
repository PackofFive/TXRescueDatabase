# Pack of Five roadmap

Updated November 24, 2026.

## Current milestone: verify Care Partner access

Implemented locally: provider verification, relationship review, animal-specific permissions, limited medical summaries, care notes with addenda, private documents, and audit history. Expiration, relationship shutdown, and custody changes have access controls. The user confirmed finishing the latest GitHub handoff for the stale-page expiration fix. The deployed revision, production migration status, and signed-in results still need verification.

Use sample records and separate organization accounts:

1. Confirm the deployed code and relevant Neon migrations, especially assignment expiration and custody revocation.
2. Approve a relationship. Verify that the provider sees no animal until an assignment is created. Check that viewers can read permitted sections and contributors can add permitted notes and documents.
3. Verify denial when permission is missing and after expiration, relationship suspension, and custody transfer. Use a separate assignment for each lifecycle test. Verify that returning an animal requires fresh authorization.
4. Confirm the assigning organization retains its records and the audit shows why access ended. Check that private audit notes and staff email addresses are visible only to authorized organization reviewers.

## Product decisions to carry forward

- One login can combine personal roles such as foster, volunteer, and pet owner with one organization. Portal navigation reflects actual access.
- Shelter Express handles shelter listings and urgent animals. Rescue Manager is for rescues. The public can offer help, while rescue tags require authorized rescue access and shelter approval.
- Shared directory listings use one source. Signed-in private notes and relationships are scoped to the authorized organization or account.
- Retain material records and their audit history. Use archival and addenda where the workflow calls for them.

## Next larger feature: donation pledges

Design a pledge as a commitment, with a clear recipient and tracking for promised, requested, and received funds. Keep repeat non-fulfillment restrictions private and provide a contact route for review and reinstatement. Working proposal: two unfulfilled pledges in twelve months. Confirm how a pledge becomes unfulfilled and how disputes or late payments affect eligibility before launch.

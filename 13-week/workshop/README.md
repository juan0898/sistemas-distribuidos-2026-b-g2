
# Week 13 — Threat Modeling Workshop

## CP0 — Setup and Boundary Claim

<!-- CONFIG-START -->
- FULL_NAME: Juan Diego Mora Alvarado
- GITHUB_USER: juan0898
- TEAM: DI LUCCA Dental Care & Technology
- DOCS_REPO: https://github.com/code-corhuila/dlc-docs
- BOUNDARY: dlc-api-gateway -> dlc-billing-api (inbound)
- CLAIM_ISSUE: https://github.com/code-corhuila/dlc-docs/issues/129
- REFLECTION_DOC: https://docs.google.com/document/d/1Gx30bxBLFK9r5wK70-q0q5hgvqKHmeJs_yrLKngJ32E/edit
- LIBRARY_BOOK: Roger S. Pressman, Software Engineering: A Practitioner's Approach (Ingeniería del software: Un enfoque práctico), 6th edition, McGraw-Hill, year and library call number pending verification
- LIBRARY_RECORD_TIME: PENDING
- STORIES: https://github.com/code-corhuila/dlc-docs/issues/134, https://github.com/code-corhuila/dlc-docs/issues/135, https://github.com/code-corhuila/dlc-docs/issues/136
<!-- CONFIG-END -->

## Trust Boundary Description

The selected trust boundary connects `dlc-api-gateway` to `dlc-billing-api`.

This boundary handles billing operations, including invoice management, payment recording, and manual charge registration.

The main domain events related to these operations are:

- `InvoiceIssued`
- `PaymentRecorded`
- `ManualChargeRecorded`

The threat model will focus on authentication, authorization, request integrity, financial data exposure, and service availability.

The goal is to identify potential security risks affecting billing operations and propose controls to protect financial information and prevent unauthorized transactions.

## Security Backlog

| Issue | STRIDE Threat | Risk | Priority |
|---|---|---|---|
| #134 | Elevation of Privilege | 9 | P0 |
| #135 | Spoofing | 6 | P1 |
| #136 | Tampering | 6 | P1 |

## Pull Requests

- Initial STRIDE analysis: https://github.com/code-corhuila/dlc-docs/pull/131
- STRIDE completion and review: https://github.com/code-corhuila/dlc-docs/pull/132

## Checkpoint Status

- CP0: Completed
- CP1: Completed
- CP2: In review
- CP3: In progress — GitHub Project assignment pending
- CP4: Pending
- CP5: Pending

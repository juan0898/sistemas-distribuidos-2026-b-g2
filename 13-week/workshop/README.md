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
- LIBRARY_BOOK: Roger S. Pressman, Ingeniería del software: Un enfoque práctico, 6th edition, McGraw-Hill, 2005, Biblioteca CORHUILA Prado Alto, call number 005.3 P727 Ej. 1, Section 20.8, p. 630
- LIBRARY_RECORD_TIME: 2026-10-29 08:20 (America/Bogota)
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

| Issue | STRIDE Threat | Risk | Priority | Project Status |
|---|---|---|---|---|
| #134 | Elevation of Privilege | 9 | P0 | Backlog |
| #135 | Spoofing | 6 | P1 | Backlog |
| #136 | Tampering | 6 | P1 | Backlog |

All three security issues are assigned to the DI LUCCA team project, `Di Lucca — Backlog`.

## Pull Requests

- Initial STRIDE analysis: https://github.com/code-corhuila/dlc-docs/pull/131
- STRIDE completion and review: https://github.com/code-corhuila/dlc-docs/pull/132

## Security CI Evidence

- Security workflow and negative authentication tests: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/b742774
- Execution documentation: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/8ad0595

The proposed security workflow includes Gitleaks, dependency auditing, and negative authentication tests.

The tests have been documented but have not yet been verified against a running Billing test environment.

## Peer Review Evidence

- Reviewed PR: https://github.com/code-corhuila/dlc-docs/pull/133
- Technical review comment: https://github.com/code-corhuila/dlc-docs/pull/133#issuecomment-6500535596
- Weekly status commit: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/d81591a

## Checkpoint Status

- CP0: Completed
- CP1: Completed
- CP2: In review — PR #132 awaiting team review
- CP3: Completed — Issues #134, #135, and #136 assigned to Di Lucca Backlog
- CP4: Completed — Security CI proposal and tests published; execution pending
- CP5: Completed — Peer review comment and weekly status published

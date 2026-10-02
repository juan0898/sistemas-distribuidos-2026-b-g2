<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.

     Your weekly grade is read AUTOMATICALLY from this file:

       09-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 09

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->

- FULL_NAME: Juan Diego Mora Alvarado
- GITHUB_USER: juan0898
- TEAM: DI LUCCA Dental Care & Technology
- SPRINT_GOAL: Prepare the Billing domain architecture and portal foundation for the implementation of microservices.

<!-- CONFIG-END -->

## 1. User stories worked this week

| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-BIL-001 | Billing Service architecture and domain foundation | doing | https://github.com/code-corhuila/dlc-docs/pull/43#issue-5636968999 |
| HU-BIL-002 | Billing Portal foundation and integration structure | doing | https://github.com/code-corhuila/dlc-docs/pull/33#issue-5616711528 |

## 2. My individual contribution

- Defined and documented the Billing Service responsibilities, boundaries and business rules.
- Documented the Billing data model including prices, manual charges, billable items, invoices and payments.
- Defined the integration events and communication responsibilities for the Billing domain.
- Documented architectural decisions using DDD and Hexagonal Architecture principles.
- Prepared the initial Angular 21 Billing Portal structure using Native Federation.
- Prepared the CI workflow for the Billing Portal using GitHub Actions.
- Established the foundation required for the next stage of development and implementation of the Billing microservice.

## 3. Blockers and risks

- The Billing Service runtime implementation has not been completed yet.
- API, database migrations, broker configuration and environment variables still require implementation and validation.
- The Billing Portal currently contains the structural foundation but not the complete functional user stories.
- Integration between the Billing components and the API Gateway remains pending.
- There is a risk of integration issues when the microservice implementation begins if the API contracts are not kept aligned with the documented domain model and events.

## 4. Plan for next week

- Begin implementation of the Billing microservice.
- Create the domain, application and infrastructure layers following Hexagonal Architecture.
- Implement the initial Billing API and its application use cases.
- Configure the PostgreSQL persistence layer and required migrations.
- Implement the necessary REST contracts.
- Begin integration with RabbitMQ and the defined Billing events.
- Add unit and integration tests for the implemented use cases.
- Continue development of the Billing Portal according to the implemented API contracts.
- Validate the service locally before integration with the other microservices.

## 5. Compliance self-check

- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links

- Billing Service documentation: https://github.com/code-corhuila/dlc-docs/pull/43#issue-5636968999
- Billing Portal foundation: https://github.com/code-corhuila/dlc-docs/pull/33#issue-5616711528
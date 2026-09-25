# Weekly Status - Week 08

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->

* FULL_NAME: Juan Diego Mora Alvarado
* GITHUB_USER: juan0898
* TEAM: DI LUCCA
* SPRINT_GOAL: Update and improve the technical documentation, including API authentication contracts and architectural diagrams, while preparing for the upcoming microservices development phase.

<!-- CONFIG-END -->

## 1. User stories worked this week

| HU ID      | Title                                                 | Status (todo/doing/done) | Evidence (PR or commit URL) |
| ---------- | ----------------------------------------------------- | ------------------------ | --------------------------- |
| HU-XXX-001 | Update API authentication documentation and contracts | done                     | [723566b12a78ee0ecf5e8f80dc2942b64c103659]      |
| HU-XXX-002 | Update architectural diagrams and documentation index | done                     | [edd29da10efbbad0a2a4106f00d27ded3f89017f]      |

## 2. My individual contribution

* Updated the `07-api` documentation, including authentication and authorization documentation, the Auth OpenAPI contract, and the corresponding contract review.
* Worked on the `08-diagrams` folder, updating the README and diagram index to document the architectural views.
* Added and organized PlantUML diagrams related to the protected request path and guarded patient deactivation.
* Ensured that the documentation reflects the project's architectural boundaries and distinguishes target designs from implemented features.

## 3. Blockers and risks

* The development of the microservices is pending the professor's delivery of the technical manual and instructions.
* Starting implementation before receiving the manual could lead to inconsistencies with the expected architecture and requirements.

## 4. Plan for next week

* Receive and review the technical manual provided by the professor.
* Analyze the implementation guidelines and requirements for the microservices.
* Begin developing the microservices according to the established architecture and technical specifications.
* Continue updating the technical documentation as implementation progresses.

## 5. Compliance self-check

* [ ] Conventional Commits - `type(scope): summary`
* [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
* [ ] Testable acceptance criteria
* [ ] Tests added/updated (unit / integration)
* [ ] DDD / hexagonal boundaries respected (domain has no I/O)
* [ ] No secrets; config via environment variables

## 6. Evidence links

* API documentation: `07-api/`
* Diagrams documentation: `08-diagrams/README.md`
* Diagram index: `08-diagrams/diagram-index.md`
* Protected request path: `04-protected-request-path.puml`
* Guarded patient deactivation: `12-guarded-patient-deactivation.puml`


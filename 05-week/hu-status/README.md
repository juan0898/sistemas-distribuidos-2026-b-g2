# Weekly Status - Week 05

- FULL_NAME: Juan Diego Mora Alvarado
- GITHUB_USER: juan0898
- TEAM: Di Lucca Dental Care & Technology
- SPRINT_GOAL: Update the platform mockup to provide role-based views and restrict access to user management.

## 1. User stories worked this week

| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-XXX-001 | Update the mockup with role-based views and permissions | done | [Updated Figma mockup](https://www.figma.com/design/HB2cfqrV1HFzARClICuitz/DI-LUCCA?node-id=84-153&t=kzGIryAN0tMs5e5m-1) |

## 2. My individual contribution

- Updated the application mockup in Figma.
- Created differentiated views for the Administrator, Doctor, and Assistant roles.
- Defined the navigation options available to each type of user.
- Kept the User Management section available to the Administrator.
- Restricted the Doctor and Assistant roles from viewing or accessing the User Management section.
- Reviewed the mockup to ensure that each role only sees the options associated with its permissions.

## 3. Blockers and risks

- No blockers were identified while updating the mockup.
- The role-based restrictions must also be enforced in the application’s authorization logic during implementation. Hiding an option in the interface alone does not prevent unauthorized access.
- The final permissions for each role should be validated with the product owner before development begins.

## 4. Plan for next week

- Validate the updated mockup with the team and product owner.
- Apply any feedback received during the design review.
- Define testable acceptance criteria for implementing role-based access.
- Prepare the user story for development.
- Verify that the frontend navigation and backend authorization follow the permissions represented in the mockup.

## 5. Compliance self-check

- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

> The unchecked development items are not applicable yet because this week’s work focused on updating the Figma mockup and did not include source-code changes.

## 6. Evidence links

- [Role-based views and permissions – Figma mockup](https://www.figma.com/design/HB2cfqrV1HFzARClICuitz/DI-LUCCA?node-id=84-153&t=kzGIryAN0tMs5e5m-1)
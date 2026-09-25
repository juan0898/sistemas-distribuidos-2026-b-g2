# Diagram Index

This registry covers deliveries 1 through 4, including functional design additions FD-01 through FD-03. IDs are stable and need not be consecutive within a delivery. Register additional views when their corresponding contribution is integrated.

| ID | Diagram | Purpose | Source | Status | Update trigger |
|---|---|---|---|---|---|
| UML-01 | System context | Actors, external systems and MVP boundary | [01-system-context.puml](diagrams/source/01-system-context.puml) | Target design | Actor, scope or external dependency change |
| UML-03 | Workspace and runtime boundary | Separates documentation/prototype from target runtime | [03-workspace-boundary.puml](diagrams/source/03-workspace-boundary.puml) | Current repository + target mapping | Repository layout or implementation evidence |
| UML-05 | Hexagonal service anatomy | Ports, adapters, domain and owned infrastructure | [05-hexagonal-service.puml](diagrams/source/05-hexagonal-service.puml) | Required architectural pattern | Hexagonal architecture rule change |
| UML-06 | Dependency rule | Allowed compile-time dependency direction | [06-dependency-rule.puml](diagrams/source/06-dependency-rule.puml) | Required architectural pattern | Module/layer dependency change |
| UML-02 | Target topology | Five services, Gateway, stores and broker | [02-target-topology.puml](diagrams/source/02-target-topology.puml) | Target design; implementation pending | Deployment or service boundary change |
| UML-07 | Target startup dependencies | Readiness order and fail-closed behavior | [07-target-startup.puml](diagrams/source/07-target-startup.puml) | Target design; implementation pending | Deployment or readiness decision |
| UML-10 | Owner-safe schema evolution | FD-01: compatible migration and recovery | [10-schema-evolution.puml](diagrams/source/10-schema-evolution.puml) | Target design; implementation pending | Migration ownership or compatibility strategy |
| UML-08 | Data ownership | Owned PostgreSQL schemas, MongoDB and contractual IDs | [08-data-ownership.puml](diagrams/source/08-data-ownership.puml) | Target design; implementation pending | Data owner or persistence change |
| UML-11 | Concurrent payments | FD-02: invoice version conflicts and idempotent replay | [11-payment-concurrency.puml](diagrams/source/11-payment-concurrency.puml) | Target design; implementation pending | Payment, locking or retry policy |
| UML-04 | Protected request path | JWT validation and owner authorization | [04-protected-request-path.puml](diagrams/source/04-protected-request-path.puml) | Target design; implementation pending | Authentication or authorization contract change |
| UML-12 | Guarded patient deactivation | FD-03: blockers, durable guards and recovery | [12-guarded-patient-deactivation.puml](diagrams/source/12-guarded-patient-deactivation.puml) | Target design; implementation pending | Patient lifecycle or private guard protocol |

See the [functional change analysis](functional-change-analysis.md) for the course comparison and acceptance scenarios included in this delivery.

## Maintenance

- Keep sources in `diagrams/source/` and derived exports in `diagrams/rendered/`.
- Update the affected source, this registry and the README in the same contribution.
- Preserve canonical names, permissions and service boundaries from the authoritative project documents.
- Do not treat a source diagram as evidence of rendering, deployment or implemented behavior.

Rendering and implementation verification remain pending.


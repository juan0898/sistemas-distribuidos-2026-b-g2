# 08 — Diagrams

This section documents Di Lucca through project-specific PlantUML sources. This cumulative edition covers deliveries 1 through 4, extending system boundaries and internal architecture with the views registered below.

## Folder structure

```text
08-diagrams/
├── README.md
├── diagram-index.md
├── functional-change-analysis.md
└── diagrams/
    ├── source/       # Editable PlantUML sources
    └── rendered/     # Generated SVG/PNG exports
```

## Diagram set through delivery 4

| ID | View | Source |
|---|---|---|
| UML-01 | System context | [01-system-context.puml](diagrams/source/01-system-context.puml) |
| UML-03 | Workspace and runtime boundary | [03-workspace-boundary.puml](diagrams/source/03-workspace-boundary.puml) |
| UML-05 | Hexagonal service anatomy | [05-hexagonal-service.puml](diagrams/source/05-hexagonal-service.puml) |
| UML-06 | Dependency rule | [06-dependency-rule.puml](diagrams/source/06-dependency-rule.puml) |
| UML-02 | Target topology | [02-target-topology.puml](diagrams/source/02-target-topology.puml) |
| UML-07 | Target startup dependencies | [07-target-startup.puml](diagrams/source/07-target-startup.puml) |
| UML-10 | Owner-safe schema evolution | [10-schema-evolution.puml](diagrams/source/10-schema-evolution.puml) |
| UML-08 | Data ownership | [08-data-ownership.puml](diagrams/source/08-data-ownership.puml) |
| UML-11 | Concurrent payments | [11-payment-concurrency.puml](diagrams/source/11-payment-concurrency.puml) |
| UML-04 | Protected request path | [04-protected-request-path.puml](diagrams/source/04-protected-request-path.puml) |
| UML-12 | Guarded patient deactivation | [12-guarded-patient-deactivation.puml](diagrams/source/12-guarded-patient-deactivation.puml) |

Identifiers remain stable across deliveries; the table includes only views contributed through this delivery. Later contributions extend this README and the [diagram index](diagram-index.md) with their own views.

The [functional change analysis](functional-change-analysis.md) records the course comparison and acceptance scenarios for FD-01 through FD-03. These views detail existing requirements, not implemented software features. FD-01 concerns operational schema evolution.

## Documentation rules

- Use PlantUML (`.puml`) and English project terminology.
- Preserve four business services plus independent transversal IAM, following ADR-003.
- Distinguish the documentation workspace and prototype from deployable runtime services.
- Respect hexagonal boundaries and inward dependency direction.
- Mark target design explicitly; diagrams do not prove implementation or deployment.
- Update this README and the diagram index with each contribution.
- Generate exports from sources; do not edit rendered files manually.

## Authoritative references

- [Project scope](../01-context/scope.md)
- [Domain map](../02-domain/domain-map.md)
- [Architecture overview](../05-architecture/overview.md)
- [Hexagonal architecture](../05-architecture/hexagonal-architecture.md)
- [Patients and transversal IAM decision](../05-architecture/decisions/records/ADR-003-patients-and-transversal-iam.md)
- [Data models](../06-data/models.md)
- [Migration strategy](../06-data/migration-strategy.md)
- [API design decisions](../07-api/design-decisions.md)
- [Service catalog](../09-microservices/service-catalog.md)

If a diagram conflicts with these sources, correct the diagram rather than silently changing a business or architecture decision.

## Rendering

From this directory, with PlantUML available:

```bash
plantuml -tsvg diagrams/source/*.puml -o ../rendered
```

Rendering remains pending. Source files describe design, not verified runtime behavior.


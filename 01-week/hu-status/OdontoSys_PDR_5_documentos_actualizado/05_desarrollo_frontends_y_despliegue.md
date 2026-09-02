# OdontoSys — Desarrollo, Frontends y Despliegue

**Responsable:** Daniel Perez Lozada

## Introducción

Este documento presenta los aspectos relacionados con el desarrollo general de la solución, los **cinco micro frontends** y el despliegue de OdontoSys. El objetivo es definir cómo estarán organizadas las aplicaciones frontend y cómo se espera ejecutar los diferentes componentes en un entorno distribuido.

También se establecen las prácticas de desarrollo que se aplicarán para mantener una solución organizada, mantenible y alineada con los principios de Ingeniería de Sistemas.

---

## 1. Principios y metodologías de desarrollo

El proyecto aplicará diferentes principios y prácticas de ingeniería de software.

### DDD — Domain-Driven Design

Se utilizará para identificar los dominios y responsabilidades principales del negocio y definir los límites de cada microservicio.

### TDD — Test-Driven Development

Se utilizará para desarrollar y validar las reglas de negocio mediante pruebas automatizadas.

### SOLID

Se aplicarán los principios SOLID para mantener un código desacoplado, mantenible y extensible.

### Clean Code

Se buscará mantener código legible, organizado y con responsabilidades claras.

### Design Patterns

Se utilizarán patrones de diseño cuando aporten soluciones adecuadas a las necesidades del sistema.

### Arquitectura Hexagonal

Los microservicios separarán la lógica de negocio de componentes externos como bases de datos, APIs y sistemas de mensajería.

## 2. Micro frontends

El sistema contará con cinco aplicaciones frontend independientes:

```text
odontosys-frontend-auth
odontosys-frontend-pacientes
odontosys-frontend-citas
odontosys-frontend-clinico
odontosys-frontend-facturacion
```

| Micro frontend | Responsabilidad |
|---|---|
| Auth | Inicio de sesión, registro, recuperación de contraseña y MFA |
| Pacientes | Gestión y consulta de información de pacientes |
| Citas | Agenda y gestión de citas |
| Clínico | Historias clínicas, odontograma y tratamientos |
| Facturación | Facturas, pagos y saldos |

## 3. Despliegue

El sistema será diseñado para desplegarse en **AWS**.

Los microservicios podrán ejecutarse de forma independiente utilizando Docker y máquinas virtuales o servicios administrados de AWS.

Una posible distribución será:

```text
AWS
│
├── Frontends
│
├── EC2 / Docker
│   ├── Auth
│   ├── Pacientes
│   ├── Citas
│   ├── Clínico
│   └── Facturación
│
├── PostgreSQL
├── MongoDB
├── RabbitMQ
└── Monitoreo
```

La distribución independiente permitirá demostrar:

- Independencia de servicios.
- Escalabilidad.
- Comunicación entre nodos.
- Tolerancia a fallos.
- Recuperación de servicios.
- Despliegue independiente.

## 4. Tecnologías

| Área | Tecnología |
|---|---|
| Auth | Spring Boot |
| Pacientes | Spring Boot |
| Citas | Spring Boot |
| Clínico | Go |
| Facturación | Spring Boot |
| Analítica | Go / Python / Java |
| Frontend | Angular |
| BD Pacientes | PostgreSQL |
| BD Citas | PostgreSQL |
| BD Clínico | MongoDB |
| BD Facturación | PostgreSQL |
| Comunicación | REST + RabbitMQ |
| Contenedores | Docker |
| Cloud | AWS |
| Control de versiones | Git / GitHub |

## 5. Responsables

| Componente | Responsable | Tecnología |
|---|---|---|
| Auth | **Harold Camilo Barrera Giraldo** | Spring Boot |
| Pacientes | **Daniel Perez Lozada** | Spring Boot |
| Citas | **Brayan Smith Bedoya** | Spring Boot |
| Clínico | **Luis Ignacio Bonilla** | Go |
| Facturación | **Juan Diego Mora** | Spring Boot |
| Analítica | **Luis Ignacio Bonilla** | Go / Python / Java |

## 6. Organización de repositorios

### Frontend

```text
odontosys-frontend-auth
odontosys-frontend-pacientes
odontosys-frontend-citas
odontosys-frontend-clinico
odontosys-frontend-facturacion
```

### Backend

```text
odontosys-backend-auth
odontosys-backend-pacientes
odontosys-backend-citas
odontosys-backend-clinico
odontosys-backend-facturacion
```

### Analítica

```text
odontosys-analytics
```

La organización definitiva de repositorios se ajustará a los requisitos establecidos para la asignatura respecto al número de repositorios backend.

## 7. Resultado esperado

Al finalizar el proyecto se espera obtener una plataforma distribuida capaz de gestionar los principales procesos de un consultorio odontológico:

```text
Usuario
   │
   ▼
Autenticación
   │
   ▼
Gestión de paciente
   │
   ▼
Agendamiento de cita
   │
   ▼
Atención odontológica
   │
   ▼
Diagnóstico / Tratamiento
   │
   ▼
Facturación
   │
   ▼
Pago
   │
   ▼
Extracción y carga de información
   │
   ▼
Analítica
   │
   ▼
Evaluación del crecimiento
```

El proyecto buscará demostrar la aplicación práctica de conceptos de **Ingeniería de Sistemas y Sistemas Distribuidos**, utilizando microservicios, comunicación síncrona y asíncrona, persistencia independiente, seguridad, analítica y despliegue distribuido.

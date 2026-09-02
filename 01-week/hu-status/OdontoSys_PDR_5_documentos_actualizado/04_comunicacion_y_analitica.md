# OdontoSys — Comunicación y Analítica

**Responsable:** Luis Ignacio Bonilla

## Introducción

Este documento describe cómo se comunicarán los diferentes componentes de **OdontoSys** y cómo se realizará el proceso de analítica. Se utilizarán mecanismos síncronos y asíncronos para mantener desacoplados los servicios.

La analítica tendrá un alcance concreto: **extraer, cargar y analizar información del sistema** para conocer cómo se está comportando el consultorio, principalmente comparando el periodo actual con el anterior.

---

## 1. Comunicación entre microservicios

La comunicación se realizará mediante dos mecanismos principales:

- REST para comunicación síncrona.
- RabbitMQ para comunicación asíncrona.

## 2. Comunicación síncrona — REST

Se utilizarán APIs REST cuando un servicio necesite una respuesta inmediata.

Ejemplo:

```text
Citas
  │
  │ HTTP REST
  ▼
Pacientes

"¿Existe el paciente 123?"
```

El servicio de Citas podrá consultar al servicio de Pacientes sin acceder directamente a su base de datos.

## 3. Comunicación asíncrona — RabbitMQ

Para eventos que no requieren una respuesta inmediata se utilizará RabbitMQ.

Ejemplo:

```text
Cita finalizada
      │
      ▼
   RabbitMQ
      │
      ├──────────► Facturación
      │
      └──────────► Analítica
```

Algunos eventos podrán ser:

```text
PACIENTE_REGISTRADO
CITA_CREADA
CITA_CANCELADA
CITA_FINALIZADA
TRATAMIENTO_REGISTRADO
PAGO_REALIZADO
```

Esto permitirá demostrar:

- Comunicación asíncrona.
- Desacoplamiento.
- Procesamiento de eventos.
- Consistencia eventual.
- Tolerancia a fallos.

## 4. Componente de Analítica

**Tecnología:** Go / Python / Java  
**Responsable:** **Luis Ignacio Bonilla**

El componente tendrá un alcance enfocado en la **extracción, carga y análisis general de la información generada por el sistema**.

No se busca inicialmente implementar modelos predictivos o inteligencia artificial.

### Extracción

Se extraerá información relacionada principalmente con:

- Pacientes.
- Citas.
- Tratamientos.
- Facturación.
- Pagos.

La extracción se realizará mediante los mecanismos definidos por la arquitectura, evitando el acceso directo a las bases de datos de otros microservicios.

### Carga

La información extraída será transformada cuando sea necesario y posteriormente cargada en una estructura destinada al análisis.

El objetivo será contar con información consolidada sin afectar directamente las bases de datos operacionales.

### Análisis

El componente permitirá responder preguntas como:

- **¿Cuántas citas se realizaron este mes y cómo se comparan con el mes anterior?**
- **¿Cuánto dinero se generó este mes y cómo se compara con el mes anterior?**
- **¿Qué tratamientos generan mayores ingresos?**
- **¿Cuántos pacientes nuevos se registraron este mes?**

A partir de estos datos se podrá identificar si el consultorio presenta una tendencia de:

- Crecimiento.
- Estabilidad.
- Disminución.

El resultado podrá ser presentado mediante un dashboard con indicadores y gráficos básicos.

# OdontoSys — Proyecto y Alcance

**Responsable:** Juan Diego Mora

## Introducción

En este documento se presenta la visión general del proyecto **OdontoSys**, una solución distribuida para la gestión de un consultorio odontológico. Se describe la necesidad que da origen al proyecto, el objetivo que se busca alcanzar, el alcance definido y los actores que participarán en el sistema.

Esta parte permite establecer el contexto general antes de entrar en los detalles técnicos de la arquitectura y de los diferentes servicios.

---

## 1. Necesidad / Problemática

Los consultorios odontológicos manejan diferentes procesos relacionados con sus pacientes, como el registro de información, la programación de citas, la atención clínica, los tratamientos y la facturación.

Estos procesos requieren una gestión adecuada de la información y una comunicación eficiente entre las diferentes áreas del consultorio. A partir de esta necesidad, se plantea desarrollar una solución que permita organizar estos procesos mediante una arquitectura distribuida.

Como estudiantes de Ingeniería de Sistemas, se decidió utilizar este contexto para aplicar conocimientos relacionados con sistemas distribuidos, arquitectura de software, seguridad, bases de datos y procesamiento de datos.

Frente a esta necesidad surge **OdontoSys**, una plataforma distribuida para la gestión de un consultorio odontológico.

## 2. Descripción del proyecto

**OdontoSys** es un sistema distribuido orientado a la gestión integral de un consultorio odontológico.

El sistema permitirá administrar los principales procesos relacionados con la atención de pacientes, incluyendo la gestión de usuarios, pacientes, citas, atención clínica, tratamientos y facturación.

La solución estará desarrollada bajo una **arquitectura basada en microservicios**, donde cada servicio tendrá una responsabilidad específica y contará con independencia lógica y de persistencia.

El sistema utilizará diferentes tecnologías de backend, bases de datos y mecanismos de comunicación con el objetivo de aplicar conceptos propios de **Ingeniería de Sistemas y Sistemas Distribuidos**, como desacoplamiento, comunicación síncrona y asíncrona, tolerancia a fallos, escalabilidad y persistencia independiente.

## 3. Objetivo general

Diseñar e implementar una solución distribuida para la gestión de un consultorio odontológico, aplicando conocimientos de Ingeniería de Sistemas en el diseño de arquitecturas de microservicios, seguridad, comunicación entre servicios, gestión independiente de datos y analítica, buscando demostrar las características y beneficios de una arquitectura distribuida.

## 4. Alcance

El sistema permitirá gestionar:

- Autenticación y autorización de usuarios.
- Gestión de roles y permisos.
- Gestión de pacientes.
- Gestión de citas y agenda odontológica.
- Historias clínicas.
- Odontogramas.
- Diagnósticos y tratamientos.
- Facturación y pagos.
- Comunicación síncrona mediante APIs REST.
- Comunicación asíncrona mediante RabbitMQ.
- Extracción y carga de información para analítica.
- Análisis general del comportamiento del consultorio.

No se contempla inicialmente:

- Integración con pasarelas de pago reales.
- Facturación electrónica.
- Integración con aseguradoras.
- Integración con sistemas externos de salud.

## 5. Actores del sistema

### Paciente

Podrá gestionar su información personal, consultar y solicitar citas, y consultar información relacionada con sus tratamientos y facturación.

### Odontólogo

Podrá consultar su agenda, acceder a la información de los pacientes y gestionar la información clínica, incluyendo historias clínicas, diagnósticos, odontogramas y tratamientos.

### Administrador

Podrá gestionar usuarios, roles, permisos y procesos administrativos del sistema.

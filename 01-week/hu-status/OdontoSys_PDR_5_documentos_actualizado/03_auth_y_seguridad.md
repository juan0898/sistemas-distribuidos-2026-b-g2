# OdontoSys — Auth y Seguridad

**Responsable:** Harold Camilo Barrera Giraldo

## Introducción

Este documento describe el componente de autenticación y las principales medidas de seguridad de **OdontoSys**. Debido a que el sistema manejará información personal, clínica y financiera, se requiere un mecanismo centralizado para gestionar la identidad de los usuarios y, al mismo tiempo, un control de acceso aplicado en cada microservicio.

El servicio Auth será desarrollado con **Spring Boot** y funcionará como componente transversal de seguridad para los demás servicios.

---

## 1. Auth Service

**Tecnología:** Spring Boot  
**Responsable:** **Harold Camilo Barrera Giraldo**

El servicio Auth será responsable de la gestión de identidad y seguridad del sistema.

Funciones principales:

- Registro de usuarios.
- Inicio de sesión.
- Generación y validación de JWT.
- Refresh Tokens.
- Gestión de roles.
- Gestión de permisos.
- Autenticación multifactor (MFA).
- Gestión de sesiones.
- Gestión de dispositivos.
- Control de acceso.

## 2. Roles

El sistema manejará inicialmente:

- Paciente.
- Odontólogo.
- Administrador.

El servicio Auth será el encargado de definir y administrar los roles y permisos.

Cada microservicio será responsable de aplicar los permisos correspondientes a sus propios recursos.

## 3. Autorización

El flujo general será:

```text
Usuario
   │
   ▼
Auth
   │
   ▼
JWT
   │
   ▼
Microservicio
   │
   ├── ¿JWT válido?
   ├── ¿Tiene el permiso?
   └── ¿Puede acceder al recurso?
```

La autenticación estará centralizada, mientras que la autorización de los recursos será aplicada en cada microservicio.

## 4. Seguridad contemplada

Se contemplan:

- JWT.
- Refresh Tokens.
- Roles y permisos.
- MFA.
- Gestión de sesiones.
- Control de dispositivos.
- Rate limiting.
- Auditoría.
- HTTPS.
- Gestión segura de secretos.

## 5. Micro frontend de Auth

El sistema contará con un micro frontend específico para autenticación:

```text
odontosys-frontend-auth
```

Su responsabilidad será proporcionar:

- Inicio de sesión.
- Registro.
- Recuperación de contraseña.
- MFA.

Después de autenticarse, el usuario podrá acceder a los módulos correspondientes según su rol y permisos.

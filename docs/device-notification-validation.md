# Confirmacion de notificaciones en dispositivo

## Objetivo

Confirmar que una notificacion de validacion fue recibida y procesada por la aplicacion Expo en un dispositivo. La confirmacion actualiza el estado del dispositivo sin modificar ni eliminar su token.

Los Expo Push Receipts se usaran para identificar errores definitivos del proveedor, pero no sustituyen la confirmacion enviada por la aplicacion movil.

## Datos de dispositivos

Agregar las siguientes columnas nullable a `device`:

```sql
estatus TEXT
updatedAt TEXT
```

Los registros existentes conservaran ambos campos en `NULL` hasta su primera validacion.

Estados propuestos:

| Estado | Significado |
| --- | --- |
| `pending` | Se envio una validacion y se espera la confirmacion de la app. |
| `valid` | La app confirmo que recibio la notificacion. |
| `unconfirmed` | Vencio el plazo sin confirmacion. No demuestra que el token sea invalido. |
| `invalid` | Expo reporto un error definitivo, como `DeviceNotRegistered`. |

`updatedAt` se actualiza al iniciar una validacion y con cada cambio de estado.

## Historial de validaciones

Crear una tabla independiente, por ejemplo `device_notification_validation`, para correlacionar cada envio con su confirmacion y conservar historial.

| Campo | Proposito |
| --- | --- |
| `id` | UUID aleatorio, clave primaria y `validationId` enviado a la app. |
| `deviceToken` | Token de `device` asociado a la validacion. |
| `estatus` | `pending`, `confirmed`, `expired` o `provider_error`. |
| `createdAt` | Fecha de creacion. |
| `expiresAt` | Fecha limite para confirmar. |
| `confirmedAt` | Fecha de confirmacion, nullable. |
| `providerError` | Error definitivo de Expo, nullable. |

Cada ejecucion debe crear una validacion por token. Esto evita que una confirmacion tardia actualice incorrectamente una ejecucion posterior.

## Tarea de backend

Crear `src/tasks/validate-device-notifications.ts`, independiente de `src/tasks/notification.ts`.

Flujo de ejecucion:

1. Obtener los tokens de `device`.
2. Crear una validacion `pending` por token con una expiracion definida.
3. Actualizar el dispositivo a `pending` y asignar `updatedAt`.
4. Enviar la notificacion por Expo incluyendo el identificador de validacion en `data`.
5. Consultar los Expo Push Receipts mediante los ticket IDs retornados por Expo.
6. Ante `DeviceNotRegistered`, marcar la validacion como `provider_error` y el dispositivo como `invalid`.
7. Mantener los receipts exitosos en `pending` hasta que la app confirme.
8. Marcar como `expired` las validaciones que excedan su plazo y como `unconfirmed` sus dispositivos, sin alterar sus tokens.

Payload propuesto:

```json
{
  "to": "ExpoPushToken[...]",
  "data": {
    "type": "device-validation",
    "validationId": "uuid"
  }
}
```

La tarea no debe actualizar, reemplazar ni eliminar `device.token`.

## Endpoint de confirmacion

Crear un endpoint, por ejemplo:

```text
POST /api/public/devices/notification-confirmations
```

Payload:

```json
{
  "token": "ExpoPushToken[...]",
  "validationId": "uuid"
}
```

El endpoint debe validar que la confirmacion existe, pertenece al token recibido, esta pendiente y no vencio. Una confirmacion ya procesada debe responder exitosamente sin hacer cambios adicionales.

Al confirmar:

1. Actualizar la validacion a `confirmed` y registrar `confirmedAt`.
2. Actualizar `device.estatus` a `valid` y asignar `updatedAt`.

El `validationId` debe ser impredecible y expirar. El endpoint debe protegerse con el mecanismo de autenticacion aplicable a las rutas publicas del API.

## Aplicacion Expo

La aplicacion movil debe usar `expo-notifications` y, cuando corresponda, `expo-task-manager`.

Responsabilidades:

1. Registrar y enviar el `ExpoPushToken` al API como lo hace actualmente.
2. Detectar las notificaciones cuya propiedad `data.type` sea `device-validation`.
3. Extraer `validationId` y llamar al endpoint de confirmacion con el token local.
4. Reintentar confirmaciones que fallen por conectividad temporal.
5. Ejecutar la confirmacion en primer plano mediante el listener de notificaciones.
6. Registrar una tarea para procesar notificaciones en segundo plano cuando Android lo permita.
7. Al abrir la app, reintentar confirmaciones pendientes almacenadas localmente.

Las notificaciones de validacion deben ser silenciosas y contener solamente `data`, salvo que las pruebas en dispositivos reales requieran un payload visible.

## Limitaciones

- Un dispositivo sin conectividad puede confirmar despues de recuperar red, siempre que la validacion siga vigente.
- Una aplicacion detenida a la fuerza desde Android puede no ejecutar tareas en segundo plano hasta que el usuario la abra.
- `unconfirmed` significa que no hubo evidencia de recepcion durante el plazo; no implica que el token sea invalido.
- `invalid` se reserva para errores definitivos reportados por Expo/FCM.

## Ejecucion manual

Crear `.github/workflows/validate-device-notifications.yml` con `workflow_dispatch`, secretos de Turso, instalacion mediante `pnpm install --frozen-lockfile` y la ejecucion:

```bash
pnpm tsx src/tasks/validate-device-notifications.ts
```

Agregar el target `validate-device-notifications` al `Makefile` para ejecutar el workflow localmente con `act`.

## Pruebas

- Creacion de una validacion por token sin cambiar tokens.
- Envio del `validationId` correcto a Expo.
- Receipt `DeviceNotRegistered` marca el dispositivo como `invalid`.
- Confirmacion valida de la app marca el dispositivo como `valid`.
- Confirmaciones inexistentes, vencidas o asociadas a otro token se rechazan.
- El endpoint es idempotente.
- Las validaciones vencidas marcan el dispositivo como `unconfirmed`.
- La aplicacion confirma en primer plano, segundo plano cuando sea soportado y despues de reintentos de red.

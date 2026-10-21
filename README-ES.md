# JC Supreme seguro

Esta es una reconstrucción limpia para reutilizar el proyecto Firebase `jc-elite-v130`. No usa PIN visible ni guarda contraseñas en Firestore.

## 1. Activar el acceso seguro

En Firebase Console abre el proyecto `jc-elite-v130` → **Authentication** → **Sign-in method** → activa **Correo electrónico/contraseña**.

Después crea el primer usuario jefe en **Authentication → Users → Add user**. Copia su UID.

En **Firestore Database**, crea manualmente `users/{UID_DEL_JEFE}` con estos campos:

```json
{
  "name": "Jefe",
  "email": "tu-correo@ejemplo.com",
  "role": "boss",
  "active": true
}
```

Para cada cobrador, crea un usuario en Authentication y después un documento `users/{UID}` con `name`, `email`, `role: "collector"` y `active: true`.

## 2. Aplicar las reglas

En Firebase Console → **Firestore Database → Rules**, reemplaza las reglas actuales por el contenido de `firestore.rules` y publica. Haz una copia de las reglas actuales antes de reemplazarlas.

Las reglas impiden lecturas anónimas y bloquean colecciones no declaradas. El jefe puede gestionar clientes y gastos; los cobradores solo trabajan con los datos que tengan asignados como propietarios.

## 3. Publicar en GitHub Pages

1. Descarga `index.html` y `firestore.rules`.
2. En tu repositorio `1005063610/Jc-app`, reemplaza el `index.html` actual.
3. No subas tokens, contraseñas ni archivos `.env`.
4. Espera a que GitHub Pages reconstruya el sitio.
5. Entra con el correo y contraseña creados en Firebase Authentication.

## Nota importante

La `apiKey` web de Firebase no es una contraseña. La seguridad depende de Authentication y de las reglas de Firestore. Nunca pongas credenciales administrativas o claves privadas dentro de `index.html`.

## Alcance de esta versión

Incluye inicio de sesión real, roles, resumen, clientes, cobros transaccionales, historial de pagos, gastos, asignación de clientes a cobradores, WhatsApp, captura GPS, validación de campos, escape de contenido HTML y diseño adaptable a celular. Los cobros se actualizan con una transacción para evitar saldos negativos cuando dos dispositivos cobran al mismo tiempo.

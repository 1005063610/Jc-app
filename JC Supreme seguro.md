# JC Supreme seguro

Esta es una reconstrucción limpia para usar el proyecto Firebase `githubio-74d97`. No usa PIN visible ni guarda contraseñas en Firestore.

## 1. Activar el acceso seguro

En Firebase Console abre el proyecto `githubio-74d97` → **Authentication** → **Sign-in method** y activa **Correo electrónico/contraseña** y **Google**. En **Authentication → Configuración → Dominios autorizados**, agrega `1005063610.github.io`. La app acepta únicamente Gmail (`@gmail.com`) y exige que las cuentas de correo confirmen su dirección; las cuentas de Google quedan verificadas por Google.

Con el botón **Continuar con Google**, cualquier cuenta Google real puede entrar por primera vez. Firebase crea automáticamente el usuario y la app crea su perfil aislado como jefe de su propio espacio. No necesita registro manual en Firebase ni copiar el UID.

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

La contraseña de Google nunca se guarda en `index.html`, Firestore ni `localStorage`: Google la protege y la app solo recibe la identidad autenticada. Cada cuenta Google ve únicamente sus propios clientes y gastos; no puede leer los datos de otra cuenta.

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

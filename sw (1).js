/* ══════════════════════════════════════
   JC Supreme — Service Worker
   Versión: 1.0
   Cachea la app para funcionar offline
══════════════════════════════════════ */

const CACHE_NAME = 'jc-supreme-v1';

// Archivos a cachear (todo lo necesario para cargar offline)
const ASSETS = [
  './',
  './index.html',
  // Firebase SDK
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js',
  // Librerías
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
  // Fuentes
  'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800;900&family=Bebas+Neue&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-solid-900.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-regular-400.woff2',
];

// INSTALL — cachea todos los assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        ASSETS.map(url =>
          cache.add(url).catch(() => {
            console.warn('[SW] No se pudo cachear:', url);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// ACTIVATE — borra cachés viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// FETCH — estrategia: Cache First, luego red
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Las peticiones a Firebase Realtime DB siempre van a la red
  if (url.hostname.includes('firebaseio.com') ||
      url.hostname.includes('googleapis.com') && url.pathname.includes('/identitytoolkit') ||
      url.hostname.includes('firebase.googleapis.com')) {
    return; // deja que Firebase maneje su propia sincronización offline
  }

  // Para todo lo demás: Cache First
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        // Solo cachear respuestas válidas
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => {
        // Si falla la red y es el HTML principal, devolver el caché
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

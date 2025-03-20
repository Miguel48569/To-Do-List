// Importando o Workbox
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

const CACHE = "anime-todo-pwa-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/img/checked.png",
  "/img/excluir.png",
  "/script.js",
];

// Instalando e armazenando os arquivos no cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting(); // Força a ativação imediata do service worker
});

// Ativando e limpando caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE) {
            return caches.delete(key); // Deleta caches antigos
          }
        })
      );
    })
  );
  self.clients.claim(); // Faz o novo SW assumir imediatamente
});

// Habilitando o pré-carregamento de navegação no Workbox
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// Interceptando as requisições para servir do cache quando offline
self.addEventListener("fetch", (event) => {
  // Tentando buscar o recurso da rede
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a resposta for válida, a armazena no cache
        const clonedResponse = response.clone();
        caches
          .open(CACHE)
          .then((cache) => cache.put(event.request, clonedResponse));
        return response;
      })
      .catch(() => {
        // Caso a rede falhe, tenta servir o recurso do cache
        return caches.match(event.request).then((cachedResponse) => {
          // Se o recurso não estiver no cache, retorna a página inicial (index.html)
          return cachedResponse || caches.match("/index.html");
        });
      })
  );
});

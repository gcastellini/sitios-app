self.addEventListener("install", async event => {
    const cache = await caches.open("recursos");
    await cache.addAll(["/"
]);
})


self.addEventListener("activate", event => {
})

self.addEventListener('fetch', (event) => {
    event.respondWith(handleRequest2(event.request));
});


async function handleRequest2(request) {
    try {
        const networkResponse = await fetch(request);
        const responseClone = networkResponse.clone();
        caches.open("recursos").then((cache) => {
            cache.put(request, responseClone);
          });

        return networkResponse;
    } catch (e) {
        const cache = await caches.open("recursos");
        const cachedResponse = await cache.match(request);
        return cachedResponse;
    }
}
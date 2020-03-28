importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
)

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

let refreshing = false
self.addEventListener('fetch', event => {
  console.log('FETCH', {
    refreshing,
    mode: event.request.mode,
    method: event.request.method,
    waiting: registration.waiting
  })
  event.respondWith(
    (async () => {
      if (
        event.request.mode === 'navigate' &&
        event.request.method === 'GET' &&
        registration.waiting &&
        !refreshing &&
        (await clients.matchAll()).length < 2
      ) {
        console.log('###### REFRESH request')
        refreshing = true
        registration.waiting.postMessage({
          type: 'SKIP_WAITING'
        })
        return new Response('', { headers: { Refresh: '0' } })
      }
      return (await caches.match(event.request)) || fetch(event.request)
    })()
  )
})

workbox.core.clientsClaim()

/* injection point for manifest files.  */
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || [])

workbox.routing.registerNavigationRoute(
  workbox.precaching.getCacheKeyForURL('/index.html'),
  {
    blacklist: [/^\/_/, /\/[^\/?]+\.[^\/]+$/]
  }
)

/* custom cache rules*/
// workbox.routing.registerNavigationRoute('/index.html', {
//   blacklist: [/^\/_/, /\/[^\/]+\.[^\/]+$/]
// })

// workbox.routing.registerRoute(
//   /\.(?:png|gif|jpg|jpeg)$/,
//   workbox.strategies.cacheFirst({
//     cacheName: 'images',
//     plugins: [
//       new workbox.expiration.Plugin({
//         maxEntries: 60,
//         maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
//       })
//     ]
//   })
// )

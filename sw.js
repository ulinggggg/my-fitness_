// PanDiet Service Worker 
const CACHE_NAME = 'pandiet-v1';

self.addEventListener('install', (event) => {
    console.log('PanDiet Service Worker: Installed');
});

self.addEventListener('fetch', (event) => {
    // 讓 App 在有網路時正常運行
    event.respondWith(fetch(event.request));
});

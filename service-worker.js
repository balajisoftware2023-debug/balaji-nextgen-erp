/********************************************************
 BALAJI NEXTGEN ERP
 SERVICE WORKER
 FILE:
 WEBSIDE/service-worker.js
********************************************************/

/* =====================================================
CACHE NAME
===================================================== */

const ERP_CACHE_NAME =
'balaji-nextgen-erp-v2';

/* =====================================================
CACHE FILES
===================================================== */

const ERP_CACHE_FILES = [

'/',
'/index.html',
'/client-login.html',
'/dashboard.html',
'/offline.html',
'/manifest.json',

/* =====================================================
CSS
===================================================== */

'/css/global/global.css',
'/css/dashboard/dashboard.css',
'/css/responsive/mobile.css',

/* =====================================================
JS CORE
===================================================== */

'/js/core/app-engine.js',
'/js/core/boot-engine.js',
'/js/core/master-init-engine.js',
'/js/core/layout-engine.js',
'/js/core/router-engine.js',
'/js/core/realtime-engine.js',
'/js/core/security-engine.js',
'/js/core/pwa-engine.js',

/* =====================================================
API
===================================================== */

'/js/api/api-engine.js',

/* =====================================================
AUTH
===================================================== */

'/js/auth/auth-engine.js',
'/js/auth/session/session-engine.js',

/* =====================================================
DASHBOARD
===================================================== */

'/js/dashboard/dashboard-engine.js',
'/js/dashboard/sidebar-engine.js',
'/js/dashboard/topbar-engine.js',

/* =====================================================
MODULES
===================================================== */

'/js/modules/module-engine.js',

/* =====================================================
UTILITIES
===================================================== */

'/js/utilities/storage-engine.js',
'/js/utilities/theme-engine.js',
'/js/utilities/loader-engine.js',
'/js/utilities/error-engine.js',
'/js/utilities/notification-engine.js',

/* =====================================================
AI
===================================================== */

'/js/ai/monitoring-engine.js',

/* =====================================================
ASSETS
===================================================== */

'/assets/logo.png',

'/assets/icons/icon-72.png',
'/assets/icons/icon-96.png',
'/assets/icons/icon-128.png',
'/assets/icons/icon-144.png',
'/assets/icons/icon-152.png',
'/assets/icons/icon-192.png',
'/assets/icons/icon-384.png',
'/assets/icons/icon-512.png'

];

/* =====================================================
INSTALL
===================================================== */

self.addEventListener(

'install',

function(event){

console.log(
'ERP SERVICE WORKER INSTALLING'
);

event.waitUntil(

caches.open(
ERP_CACHE_NAME
)
.then(function(cache){

console.log(
'ERP CACHE CREATED'
);

return cache.addAll(
ERP_CACHE_FILES
);

})

);

self.skipWaiting();

}

);

/* =====================================================
ACTIVATE
===================================================== */

self.addEventListener(

'activate',

function(event){

console.log(
'ERP SERVICE WORKER ACTIVATED'
);

event.waitUntil(

caches.keys()
.then(function(cacheNames){

return Promise.all(

cacheNames.map(function(cacheName){

if(
cacheName !== ERP_CACHE_NAME
){

console.log(
'OLD CACHE REMOVED:',
cacheName
);

return caches.delete(
cacheName
);

}

})

);

})

);

self.clients.claim();

}

);

/* =====================================================
FETCH
===================================================== */

self.addEventListener(

'fetch',

function(event){

/* =====================================================
IGNORE NON-GET
===================================================== */

if(
event.request.method !== 'GET'
){

return;

}

event.respondWith(

caches.match(
event.request
)
.then(function(cachedResponse){

/* =====================================================
RETURN CACHE
===================================================== */

if(cachedResponse){

return cachedResponse;

}

/* =====================================================
NETWORK FETCH
===================================================== */

return fetch(
event.request
)
.then(function(networkResponse){

/* =====================================================
INVALID RESPONSE
===================================================== */

if(

!networkResponse
||
networkResponse.status !== 200
||
networkResponse.type !== 'basic'

){

return networkResponse;

}

/* =====================================================
CLONE
===================================================== */

const responseClone =
networkResponse.clone();

/* =====================================================
SAVE CACHE
===================================================== */

caches.open(
ERP_CACHE_NAME
)
.then(function(cache){

cache.put(
event.request,
responseClone
);

});

/* =====================================================
RETURN NETWORK
===================================================== */

return networkResponse;

})
.catch(function(error){

console.log(
'FETCH ERROR:',
error
);

/* =====================================================
OFFLINE HTML
===================================================== */

if(
event.request.destination === 'document'
){

return caches.match(
'/offline.html'
);

}

});

})

);

}

/* =====================================================
MESSAGE EVENT
===================================================== */

);

self.addEventListener(

'message',

function(event){

if(
event.data
&&
event.data.action ===
'SKIP_WAITING'
){

self.skipWaiting();

}

}

);

/* =====================================================
PUSH NOTIFICATION
===================================================== */

self.addEventListener(

'push',

function(event){

const title =
'BALAJI NEXTGEN ERP';

const options = {

body :
event.data
?
event.data.text()
:
'NEW ERP NOTIFICATION',

icon :
'/assets/icons/icon-192.png',

badge :
'/assets/icons/icon-192.png',

vibrate :
[200,100,200],

data : {

url :
'/dashboard.html'

},

actions : [

{

action:'open',

title:'Open ERP'

},

{

action:'close',

title:'Close'

}

]

};

event.waitUntil(

self.registration.showNotification(
title,
options
)

);

}

);

/* =====================================================
NOTIFICATION CLICK
===================================================== */

self.addEventListener(

'notificationclick',

function(event){

event.notification.close();

if(
event.action === 'close'
){

return;

}

event.waitUntil(

clients.matchAll({

type:'window',
includeUncontrolled:true

})
.then(function(clientList){

for(
let i = 0;
i < clientList.length;
i++
){

const client =
clientList[i];

if(
client.url.includes(
'/dashboard.html'
)
&&
'focus' in client
){

return client.focus();

}

}

if(clients.openWindow){

return clients.openWindow(
'/dashboard.html'
);

}

})

);

}

);

/* =====================================================
BACKGROUND SYNC
===================================================== */

self.addEventListener(

'sync',

function(event){

if(
event.tag ===
'erp-background-sync'
){

event.waitUntil(

console.log(
'BACKGROUND ERP SYNC RUNNING'
)

);

}

}

);

/* =====================================================
ERROR
===================================================== */

self.addEventListener(

'error',

function(error){

console.log(
'SERVICE WORKER ERROR:',
error
);

}

);

console.log(
'BALAJI NEXTGEN ERP SERVICE WORKER LOADED'
);
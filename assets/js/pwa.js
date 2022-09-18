// Service Worker Register 

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('Service Worker Registered',registration.scope)
        }).catch(err => {
            console.log({err});
        });
    });
}
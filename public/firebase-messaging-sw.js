importScripts('https:/www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyDS8T_nIp0dZBKlc0-KR9uPtRL7-bcM4K4",
    authDomain: "itrack-edab8.firebaseapp.com",
    projectId: "itrack-edab8",
    storageBucket: "itrack-edab8.firebasestorage.app",
    messagingSenderId: "1053684549574",
    appId: "1:1053684549574:web:dec5d699ed6ea644ef14c7",
    measurementId: "G-VNHHMRK09Z"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message ', payload);

    const notificationTitle = payload.data.title;
    const notificationOptions = {
        body: payload.data.body,
        icon: payload.data.image,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// messaging.onBackgroundMessage(function (payload) {
//     console.log("📩 Received background message", payload);

//     const notificationTitle = payload.data.title;
//     const notificationOptions = {
//         body: payload.data.body,
//         icon: payload.data.icon,
//         // data: {
//         //     click_action: payload.data.click_action,
//         // }
//     };

//     self.registration.showNotification(notificationTitle, notificationOptions);
// });

// self.addEventListener('notificationclick', function (event) {
//     event.notification.close();

//     const urlToOpen = event.notification.data.click_action;

//     event.waitUntil(
//         clients.matchAll({
//             type: 'window',
//             includeUncontrolled: true
//         }).then(windowClients => {
//             // Check if there's already a tab open with this URL
//             for (let client of windowClients) {
//                 if (client.url === urlToOpen && 'focus' in client) {
//                     return client.focus();
//                 }
//             }
//             // If not, open a new tab
//             if (clients.openWindow) {
//                 return clients.openWindow(urlToOpen);
//             }
//         })
//     );
// });
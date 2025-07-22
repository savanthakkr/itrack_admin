import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDS8T_nIp0dZBKlc0-KR9uPtRL7-bcM4K4",
    authDomain: "itrack-edab8.firebaseapp.com",
    projectId: "itrack-edab8",
    storageBucket: "itrack-edab8.firebasestorage.app",
    messagingSenderId: "1053684549574",
    appId: "1:1053684549574:web:dec5d699ed6ea644ef14c7",
    measurementId: "G-VNHHMRK09Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
        const token = await getToken(messaging, {
            vapidKey: 'BO8c98zdUEx5a6FPBiOYCQJyk-KWcg0Njn1VTGXlYYIJjVv0Y8y9tl3MsWIjs43Ar8UMPrwjnNfPGZ5gFZnHYNQ'
        });
        console.log('token', token);
        return token;

    }
}
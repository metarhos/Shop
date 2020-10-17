import firebase from "firebase";
import "firebase/storage"
// Your web app's Firebase configuration
const firebaseConfig = {
    //my config
    apiKey: "AIzaSyC-NtpyI7GORwGBcnevS0uc8V2QPO36E6E",
    authDomain: "employees-9f99f.firebaseapp.com",
    databaseURL: "https://employees-9f99f.firebaseio.com",
    projectId: "employees-9f99f",
    storageBucket: "employees-9f99f.appspot.com",
    messagingSenderId: "424949766061",
    appId: "1:424949766061:web:c358827172fe3aa875f324"


    //Uriy config
    // apiKey: "AIzaSyD73f6CAF35xf6l6_KlgG-ybD46kOGbexs",
    // authDomain: "employees-50edc.firebaseapp.com",
    // databaseURL: "https://employees-50edc.firebaseio.com",
    // projectId: "employees-50edc",
    // storageBucket: "employees-50edc.appspot.com",
    // messagingSenderId: "280730905574",
    // appId: "1:280730905574:web:6cef5c3d310d0a384f8427"
};
// Initialize Firebase
const appFirebase = firebase.initializeApp(firebaseConfig);
export const storage = firebase.storage();
export default appFirebase;

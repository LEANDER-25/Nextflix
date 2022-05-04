import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCCWfqLJZrO5wg-NCx3FE-6x06VCp6XHlw",
  authDomain: "my-nextflix-project.firebaseapp.com",
  projectId: "my-nextflix-project",
  storageBucket: "my-nextflix-project.appspot.com",
  messagingSenderId: "70685081222",
  appId: "1:70685081222:web:d8eade87baa41b4e60db07",
  measurementId: "G-PT014DL3ZT"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
export default storage;

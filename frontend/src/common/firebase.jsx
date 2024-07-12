import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCSTIYFFL7uIPavAUsbblk3l2qGClcFC0U",
  authDomain: "react-blogging-website-482a1.firebaseapp.com",
  projectId: "react-blogging-website-482a1",
  storageBucket: "react-blogging-website-482a1.appspot.com",
  messagingSenderId: "649573393910",
  appId: "1:649573393910:web:a588df2f30caa8650693d7",
  measurementId: "G-0NFX1FJ7T5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//google auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {

    let user = null;

    await signInWithPopup(auth, provider)
    .then((result) => {
        user = result.user
    })
    .catch((err) => {
        console.log(err)
    })

    //return user;
    if (user) {
        const accessToken = await user.getIdToken();
        return { user, accessToken };
    }

    return null;
}
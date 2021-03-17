import firebase from 'firebase/app'
import 'firebase/auth'
import { firebaseConfig } from '../config'

if (!firebase.apps.length) {
    console.log(process.env)
    firebase.initializeApp(firebaseConfig)
}

export default firebase
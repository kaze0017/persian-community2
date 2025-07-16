import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'  // <-- import storage

const firebaseConfig = {
  apiKey: "AIzaSyCOaimMp_wO1aINDm4JnNm7fonbE6PSm6g",
  authDomain: "persian-community.firebaseapp.com",
  projectId: "persian-community",
  storageBucket: "persian-community.firebasestorage.app",
  messagingSenderId: "827577084138",
  appId: "1:827577084138:web:b50c57d6f2f0758a404f93",
  measurementId: "G-F5L4433ZK2"
};
const app = initializeApp(firebaseConfig)

let analytics: ReturnType<typeof getAnalytics> | null = null
isAnalyticsSupported().then((yes) => {
  if (yes) {
    analytics = getAnalytics(app)
  }
})

export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)  // <-- export storage
export { analytics }

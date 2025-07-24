import * as admin from 'firebase-admin';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const bucket = admin.storage().bucket();

export { admin, bucket };

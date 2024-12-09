// config/firebaseAdmin.js

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK with your service account credentials
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(path.join(__dirname, 'serviceAccountKey.json')) // Make sure this path is correct
  });
}

module.exports = admin;

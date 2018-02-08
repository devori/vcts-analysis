import * as firebase from 'firebase-admin';

let db;

export function initialize(serviceAccount) {
    if (db) {
        return;
    }
    firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
    });
    db = firebase.database();
}

export function addAssets(user, market, timestamp, data) {
    const ref = db.ref(`accounts/${user}/markets/${market}/assets/${timestamp}`);
    ref.set(data);
}

export function addTickers(market, timestamp, data) {
    const ref = db.ref(`markets/${market}/tickers/${timestamp}`);
    ref.set(data);
}
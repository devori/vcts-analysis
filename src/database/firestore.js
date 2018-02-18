import * as admin from 'firebase-admin';

let db;

export function initialize(serviceAccount) {
    if (db) {
        return;
    }
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
}

export function recordAssets(user, market, data) {
    const dbRef = db
        .collection('analysis')
        .doc('assets')
        .collection('accounts')
        .doc(user)
        .collection('markets')
        .doc(market);

    Object.keys(data).forEach(base => {
        dbRef
            .collection(base)
            .add(data[base]);
    });
}

export function recordTickers(market, data) {
    const dbRef = db
        .collection('analysis')
        .doc('tickers')
        .collection('markets')
        .doc(market);

    Object.keys(data).forEach((base) => {
        dbRef
            .collection(base)
            .add(data[base]);
    });
}

export function searchTickers(market, base, start, end) {
    let dbRef = db
        .collection('analysis')
        .doc('tickers')
        .collection('markets')
        .doc(market)
        .collection(base);

    if (start) {
        dbRef = dbRef.where('timestamp', '>=', start);
    }

    if (end) {
        dbRef = dbRef.where('timestamp', '<=', end);
    }

    return dbRef.get().then(docs => {
        const result = [];
        docs.forEach(d => result.push(d.data()));
        return result;
    });
}

export function searchAssets(user, market, base, start, end) {
    let dbRef = db
        .collection('analysis')
        .doc('assets')
        .collection('accounts')
        .doc(user)
        .collection('markets')
        .doc(market)
        .collection(base);

    if (start) {
        dbRef = dbRef.where('timestamp', '>=', start);
    }

    if (end) {
        dbRef = dbRef.where('timestamp', '<=', end);
    }

    return dbRef.get();
}

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

export function recordAssetsSummary(user, market, assets, tickers) {
    const dbRef = db
        .collection('analysis')
        .doc('summaries')
        .collection('accounts')
        .doc(user)
        .collection('markets')
        .doc(market);

    Object.keys(assets).forEach(base => {
        const units = Object.keys(assets[base])
            .filter(name => name !== 'timestamp')
            .filter(name => base === name || tickers[base][name] !== undefined)
            .reduce((accum, name) => {
                const arr = assets[base][name];
                const bid = base === name ? 1 : (tickers[base][name].bid || 0);
                return accum + arr.reduce((sum, {units = 0}) => sum + units * bid, 0);
            }, 0);

        dbRef
            .collection(base)
            .add({
                units,
                rate: {
                    usdt: base === 'USDT' ? 1 : tickers['USDT'][base].bid
                },
                timestamp: assets[base].timestamp,
            });
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
    return search('assets', user, market, base, start, end);
}

export function searchAssetsSummary(user, market, base, start, end) {
    return search('summaries', user, market, base, start, end);
}

function search(type, user, market, base, start, end) {
    let dbRef = db
        .collection('analysis')
        .doc(type)
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

    return dbRef.get().then(docs => {
        const result = [];
        docs.forEach(d => result.push(d.data()));
        return result;
    });
}

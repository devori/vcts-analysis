import {Router} from 'express';
import * as firestore from '../database/firestore';

const router = Router();

router.use((req, res, next) => {
    next();
});

router.get('/tickers/:market/:base', (req, res) => {
    const {market, base} = req.params;
    const {start, end} = req.query;

    if (!start && !end) {
        throw 'Cannot be empty start and end all';
    }

    firestore.searchTickers(market, base, Number(start), Number(end)).then(tickers => {
        res.json(tickers);
    });
});

router.get('/assets/:user/:market/:base', (req, res) => {
    const {user, market, base} = req.params;
    const {summary, start, end} = req.query;

    if (!start && !end) {
        throw 'Cannot be empty start and end all';
    }

    if (summary === 'true') {
        firestore.searchAssetsSummary(user, market, base, Number(start), Number(end)).then(assets => {
            res.json(assets);
        });
    } else {
        firestore.searchAssets(user, market, base, Number(start), Number(end)).then(assets => {
            res.json(assets);
        });
    }
});

// router.get('/refine', (req, res) => {
//     firestore.searchTickers('binance', 'USDT', undefined, undefined).then(usdtTicker => {
//         return firestore.searchTickers('binance', 'BTC', undefined, undefined).then(btcTickers=> {
//             usdtTicker.sort((u1, u2) => u1.timestamp - u2.timestamp);
//             btcTickers.sort((b1, b2) => b1.timestamp - b2.timestamp);
//
//             const result = [];
//             let u = 0, b = 0;
//             while (u < usdtTicker.length && b < btcTickers.length) {
//                 if (usdtTicker[u].timestamp < btcTickers[b].timestamp) {
//                     u++;
//                     continue;
//                 }
//                 if (usdtTicker[u].timestamp > btcTickers[b].timestamp) {
//                     b++;
//                     continue;
//                 }
//                 result.push({
//                     BTC: btcTickers[b],
//                     USDT: usdtTicker[u],
//                     timestamp: btcTickers[b].timestamp
//                 });
//                 u++;
//                 b++;
//             }
//             console.log(result.length);
//             return result;
//         });
//     }).then(tickers => {
//         return firestore.searchAssets('dev-account', 'binance', 'BTC', undefined, undefined).then(assets => {
//             return {assets, tickers};
//         });
//     }).then(({assets, tickers}) => {
//         assets.sort((a1, a2) => a1.timestamp - a2.timestamp);
//         tickers.sort((t1, t2) => t1.timestamp - t2.timestamp);
//
//         let count = 0;
//         let aidx = 0, tidx = 0;
//         while (aidx < assets.length && tidx < tickers.length) {
//             const a = assets[aidx];
//             const t = tickers[tidx];
//             if (a.timestamp < t.timestamp) {
//                 aidx++;
//                 console.log('asset', a.timestamp)
//                 continue;
//             } else if (a.timestamp > t.timestamp) {
//                 tidx++;
//                 console.log('ticker', t.timestamp)
//                 continue;
//             }
//             aidx++;
//             tidx++;
//             firestore.recordAssetsSummary('dev-account', 'binance', {'BTC': a}, t);
//         }
//         console.log(assets.length, tickers.length, count);
//         res.send('end!!')
//     })
// });

export default router;

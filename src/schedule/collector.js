import * as db from '../database/firestore';
import * as vctsApi from '../api/vcts';

const intervalIds = {};

export function start(interval, user, market) {
    intervalIds[user] = intervalIds[user] || {};
    intervalIds[user][market] = setInterval(() => {
        collect(user, market);
    }, interval);
}

export function stop(user, market) {
    clearInterval(intervalIds[user][market]);
}

export function collect(user, market) {
    const timestamp = new Date().getTime();

    vctsApi.getAssets(user, market).then(assets => {
        return vctsApi.getTickers(market).then(tickers => ({assets, tickers}));
    }).then(({assets, tickers}) => {
        Object.keys(assets).forEach(base => {
            assets[base].timestamp = timestamp;
        });
        db.recordAssets(user, market, assets);

        Object.keys(tickers).forEach(base => {
            tickers[base].timestamp = timestamp;
        });
        db.recordTickers(market, tickers);

        db.recordAssetsSummary(user, market, assets, tickers);
    }).catch((err) => console.log(err));
}
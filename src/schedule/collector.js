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

    vctsApi.getAssets(user, market).then((data) => {
        Object.keys(data).forEach(base => {
            data[base].timestamp = timestamp;
        });
        db.recordAssets(user, market, data);
    }).catch((err) => console.log(err));

    vctsApi.getTickers(market).then((data) => {
        Object.keys(data).forEach(base => {
            data[base].timestamp = timestamp;
        });
        db.recordTickers(market, data);
    }).catch((err) => console.log(err));
}
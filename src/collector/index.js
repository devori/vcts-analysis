import * as db from '../database';
import * as vctsApi from '../api/vcts';

export function collect(user, market) {
    const timestamp = new Date().getTime();

    vctsApi.getAssets(user, market).then((data) => {
        db.addAssets(user, market, timestamp, data);
    }).catch((err) => console.log(err));

    vctsApi.getTickers(market).then((data) => {
        db.addTickers(market, timestamp, data);
    }).catch((err) => console.log(err));
}
import axios from 'axios';
import {VCTS_PRIVATE_API_URL, VCTS_PUBLIC_API_URL} from '../properties';

export function getAssets(userId, market) {
    return axios.get(`${VCTS_PRIVATE_API_URL}/users/${userId}/markets/${market}/assets`)
        .then(({data}) => data)
        .catch(() => {});
}

export function getTickers(market) {
    return axios.get(`${VCTS_PUBLIC_API_URL}/markets/${market}/tickers`)
        .then(({data}) => data)
        .catch(() => {});
}
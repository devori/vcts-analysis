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
    const {start, end} = req.query;

    if (!start && !end) {
        throw 'Cannot be empty start and end all';
    }

    firestore.searchAssets(user, market, base, Number(start), Number(end)).then(assets => {
        res.json(assets);
    });
});

export default router;

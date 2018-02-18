import express from 'express';
import bodyParser from 'body-parser';
import supertest from 'supertest';
import sinon from 'sinon';
import {expect, should} from 'chai';
import privateRouter from '../../src/router/private';
import * as firestore from '../../src/database/firestore';

describe('router/private', function () {

    let app;
    before(() => {
        sinon.stub(firestore, 'searchTickers').resolves(['tickers']);
        sinon.stub(firestore, 'searchAssets').resolves(['assets']);

        app = express();
        app.use(bodyParser.json());
        app.use('/', privateRouter);
    });

    after(() => {
        firestore.searchTickers.restore();
    });

    it('return matched tickers', done => {
        supertest(app)
            .get('/tickers/poloniex/test')
            .query({start: '1', end: '2'})
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200, ['tickers'])
            .end(done);
    });

    it('return matched assets', done => {
        supertest(app)
            .get('/assets/test-user/poloniex/test')
            .query({start: '1', end: '2'})
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200, ['assets'])
            .end(done);
    });
});

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

    describe('GET /tickers/:market/:base', () => {
        it('return matched tickers', done => {
            supertest(app)
                .get('/tickers/poloniex/test')
                .query({start: '1', end: '2'})
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200, ['tickers'])
                .end(done);
        });

        it('return 500 when start and end are empty all', done => {
            supertest(app)
                .get('/tickers/poloniex/test')
                .expect(500)
                .end(done);
        });
    });

    describe('GET /assets/:user/:market/:base', () => {
        it('return matched assets', done => {
            supertest(app)
                .get('/assets/test-user/poloniex/test')
                .query({start: '1', end: '2'})
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200, ['assets'])
                .end(done);
        });

        it('return 500 when start and end are empty all', done => {
            supertest(app)
                .get('/assets/test-user/poloniex/test')
                .expect(500)
                .end(done);
        });
    });
});

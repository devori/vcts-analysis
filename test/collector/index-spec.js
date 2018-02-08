import {expect} from 'chai';
import sinon from 'sinon';
import * as db from '../../src/database';
import * as vctsApi from '../../src/api/vcts';
import * as collector from '../../src/collector';

describe('collector/index', () => {
    const USER = 'test-user';
    const MARKET = 'test-market';

    beforeEach(() => {
        sinon.stub(vctsApi, 'getAssets').resolves('hello assets');
        sinon.stub(vctsApi, 'getTickers').resolves('hello tickers');

        sinon.stub(db, 'addAssets').returns('');
        sinon.stub(db, 'addTickers').returns('');
    });

    afterEach(() => {
        vctsApi.getAssets.restore();
        vctsApi.getTickers.restore();
        db.addAssets.restore();
        db.addTickers.restore();
    });

    describe('collect', () => {
        it('calls db methods with api resuls, it calls', (done) => {
            collector.collect(USER, MARKET);

            setTimeout(() => {
                expect(db.addAssets.calledWith(USER, MARKET, sinon.match.any, 'hello assets')).to.be.true;
                expect(db.addTickers.calledWith(MARKET, sinon.match.number, 'hello tickers')).to.be.true;
                done();
            }, 100);
        });
    });
});
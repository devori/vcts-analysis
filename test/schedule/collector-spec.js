import sinon from 'sinon';
import {expect, should} from 'chai';
import * as firestore from '../../src/database/firestore';
import * as collector from '../../src/schedule/collector';
import * as vctsApi from '../../src/api/vcts';

describe('schedule/collector', () => {

    const INTERVAL = 12345678;
    const USER = 'test-user';
    const MARKET = 'test-market';
    const BASE = 'test-base';

    let spySetInterval = sinon.spy();
    let spyClearInterval = sinon.spy();

    beforeEach(() => {
        global.setInterval = spySetInterval;
        global.clearInterval = spyClearInterval;

        sinon.stub(firestore, 'recordAssets');
        sinon.stub(firestore, 'recordTickers');
        sinon.stub(firestore, 'recordAssetsSummary');

        sinon.stub(vctsApi, 'getAssets').resolves({[BASE]: {}});
        sinon.stub(vctsApi, 'getTickers').resolves({[BASE]: {}});
    });

    afterEach(() => {
        global.setInterval.reset();
        global.clearInterval.reset();

        firestore.recordAssets.restore();
        firestore.recordTickers.restore();
        firestore.recordAssetsSummary.restore();

        vctsApi.getAssets.restore();
        vctsApi.getTickers.restore();
    });

    describe('start', () => {
        beforeEach(() => {
            collector.start(INTERVAL, USER, MARKET);
        });

        it('call setInterval with interval time', () => {
            expect(spySetInterval.args[0][1]).to.equal(12345678);
        });

        it('call recordAssets when func run', done => {
            spySetInterval.args[0][0]();

            setTimeout(() => {
                expect(firestore.recordAssets.calledWith(USER, MARKET, sinon.match.has(BASE))).to.be.true;
                done();
            }, 100);
        });

        it('call recordAssets when func run', done => {
            spySetInterval.args[0][0]();

            setTimeout(() => {
                expect(firestore.recordTickers.calledWith(MARKET, sinon.match.has(BASE))).to.be.true;
                done();
            }, 100);
        });

        it('call recordAssets when func run', done => {
            spySetInterval.args[0][0]();

            setTimeout(() => {
                expect(firestore.recordAssetsSummary.calledWith(USER, MARKET, sinon.match.has(BASE), sinon.match.has(BASE))).to.be.true;
                done();
            }, 100);
        });
    });

    describe('stop', () => {
        it('call clearInterval', () => {
            collector.start(INTERVAL, USER, MARKET);
            collector.stop(USER, MARKET);

            expect(spyClearInterval.calledWith(undefined)).to.be.true;
        });
    });
});
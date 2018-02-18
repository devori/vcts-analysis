import sinon from 'sinon';
import {expect, should} from 'chai';
import * as firebaseAdmin from 'firebase-admin';
import * as firestore from '../../src/database/firestore';

describe('database/firestore', () => {

    const USER = 'test-user';
    const MARKET = 'test-market';
    const BASE = 'test-base';

    let stubCollection = sinon.stub();
    let stubDoc = sinon.stub();
    let stubWhere = sinon.stub();
    let stubGet = sinon.stub();
    let spyAdd = sinon.spy();

    const stubDb = {
        collection: stubCollection,
        doc: stubDoc,
        where: stubWhere,
        get: stubGet,
        add: spyAdd,
    };

    beforeEach(() => {
        stubCollection.returns(stubDb);
        stubDoc.returns(stubDb);
        stubWhere.returns(stubDb);

        sinon.stub(firebaseAdmin, 'initializeApp');
        sinon.stub(firebaseAdmin.credential, 'cert');
        sinon.stub(firebaseAdmin, 'firestore').returns(stubDb);

        firestore.initialize('service-account');
    });

    afterEach(() => {
        stubCollection.reset();
        stubDoc.reset();
        stubWhere.reset();
        stubGet.reset();
        spyAdd.reset();

        firebaseAdmin.initializeApp.restore();
        firebaseAdmin.credential.cert.restore();
        firebaseAdmin.firestore.restore();
    });

    describe('initialize', () => {
        it('should initialize firestore', () => {

            expect(firebaseAdmin.initializeApp.called).to.be.true;
            expect(firebaseAdmin.credential.cert.calledWith('service-account')).to.be.true;
            expect(firebaseAdmin.firestore.called).to.be.true;
        });
    });

    describe('recordTickers', () => {
        it('set to firestore', () => {
            firestore.recordTickers(MARKET, {[BASE]: '123'});

            expect(stubCollection.firstCall.calledWith('analysis')).to.be.true;
            expect(stubDoc.firstCall.calledWith('tickers')).to.be.true;
            expect(stubCollection.secondCall.calledWith('markets')).to.be.true;
            expect(stubDoc.secondCall.calledWith(MARKET)).to.be.true;
            expect(stubCollection.thirdCall.calledWith(BASE)).to.be.true;
            expect(spyAdd.calledWith('123')).to.be.true;
        });
    });

    describe('recordAssets', () => {
        it('set to firestore with timestamp', () => {
            firestore.recordAssets(USER, MARKET, {[BASE]: '123'});

            expect(stubCollection.getCall(0).calledWith('analysis')).to.be.true;
            expect(stubDoc.getCall(0).calledWith('assets')).to.be.true;
            expect(stubCollection.getCall(1).calledWith('accounts')).to.be.true;
            expect(stubDoc.getCall(1).calledWith(USER)).to.be.true;
            expect(stubCollection.getCall(2).calledWith('markets')).to.be.true;
            expect(stubDoc.getCall(2).calledWith(MARKET)).to.be.true;
            expect(stubCollection.getCall(3).calledWith(BASE)).to.be.true;
            expect(spyAdd.calledWith('123')).to.be.true;
        });
    });

    describe('searchTickers', () => {
        beforeEach(() => {
            stubGet.resolves([]);
        });

        it('call get without where when start and end are empty', () => {
            firestore.searchTickers(MARKET,  BASE);

            expect(stubCollection.firstCall.calledWith('analysis')).to.be.true;
            expect(stubDoc.firstCall.calledWith('tickers')).to.be.true;
            expect(stubCollection.secondCall.calledWith('markets')).to.be.true;
            expect(stubDoc.secondCall.calledWith(MARKET)).to.be.true;
            expect(stubCollection.thirdCall.calledWith(BASE)).to.be.true;
            expect(stubWhere.called).to.be.false;
            expect(stubGet.called).to.be.true;
        });

        it('call where with start when start exists', () => {
            firestore.searchTickers(MARKET, BASE, 123);

            expect(stubWhere.calledWith('timestamp', '>=', 123)).to.be.true;
        });

        it('call where with end when end exists', () => {
            firestore.searchTickers(MARKET, BASE, null, 123);

            expect(stubWhere.calledWith('timestamp', '<=', 123)).to.be.true;
        });
    });

    describe('searchAssets', () => {
        it('call get without where when start and end are empty', () => {
            firestore.searchAssets(USER, MARKET, BASE);

            expect(stubCollection.firstCall.calledWith('analysis')).to.be.true;
            expect(stubDoc.firstCall.calledWith('assets')).to.be.true;
            expect(stubCollection.secondCall.calledWith('accounts')).to.be.true;
            expect(stubDoc.secondCall.calledWith(USER)).to.be.true;
            expect(stubCollection.thirdCall.calledWith('markets')).to.be.true;
            expect(stubDoc.thirdCall.calledWith(MARKET)).to.be.true;
            expect(stubCollection.getCall(3).calledWith(BASE)).to.be.true;
            expect(stubWhere.called).to.be.false;
            expect(stubGet.called).to.be.true;
        });

        it('call where with start when start exists', () => {
            firestore.searchAssets(USER, MARKET, BASE, 123);

            expect(stubWhere.calledWith('timestamp', '>=', 123)).to.be.true;
        });

        it('call where with end when end exists', () => {
            firestore.searchAssets(USER, MARKET, BASE, null, 123);

            expect(stubWhere.calledWith('timestamp', '<=', 123)).to.be.true;
        });
    });
});
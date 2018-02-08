import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {expect} from 'chai';
import env from '../../src/properties';
import * as vctsApi from '../../src/api/vcts';

describe('api/vcts', () => {
    const USER_ID = 'test-id';
    const MARKET = 'test-market';
    const BASE = 'test-base';
    const mockAxios = new MockAdapter(axios);

    before(() => {
        mockAxios
            .onGet(`${env.VCTS_PRIVATE_API_URL}/users/${USER_ID}/markets/${MARKET}/assets`)
                .reply(200, {
                    [BASE]: {A: [], B: []}
                })
            .onGet(`${env.VCTS_PUBLIC_API_URL}/markets/${MARKET}/tickers`)
                .reply(200, {
                    [BASE]: {A: {}, B: {}}
                });
    });

    after(() => {
        mockAxios.restore();
    });

    describe('getAssets', () => {
        it('return assets as promise when it calls', (done) => {
            const result = vctsApi.getAssets(USER_ID, MARKET);

            expect(result).to.be.a('promise');
            result.then((data) => {
                expect(data[BASE].A).to.deep.equal([]);
                expect(data[BASE].B).to.deep.equal([]);
                done();
            });
        });
    });

    describe('getTickers', () => {
        it('return tickers as promise when it calls', (done) => {
            const result = vctsApi.getTickers(MARKET);

            expect(result).to.be.a('promise');
            result.then((data) => {
                expect(data[BASE].A).to.deep.equal({});
                expect(data[BASE].B).to.deep.equal({});
                done();
            });
        });
    });
});

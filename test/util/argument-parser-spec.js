import {expect} from 'chai';
import * as argumentParser from '../../src/util/argument-parser';

describe('util/argument-parser', () => {
    it('return parsed object', () => {
        const result = argumentParser.parse(['--a', 'aaa', '--b', 'bbb']);

        expect(result.a).to.equal('aaa');
        expect(result.b).to.equal('bbb');
    });

    it('throw exception when key does not start --', done => {
        try {
            argumentParser.parse(['a', 'aaa']);
        } catch (e) {
            done();
        }
    });
});
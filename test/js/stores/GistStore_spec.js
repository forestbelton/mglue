import { expect } from 'chai';
import { createDispatcher } from 'dispatchr';
import GistStore from '../../../js/stores/GistStore';

describe('GistStore', () => {
    function makeGist() {
        return {
            url:     'test-url' + Math.random(),
            content: 'test content' + Math.random()
        };
    }

    var dispatcher;

    beforeEach(() => {
        dispatcher = createDispatcher({
            stores: [GistStore]
        }).createContext({});
    });

    it('returns undefined for a gist that does not exist', () => {
        const content = dispatcher.getStore(GistStore).getGist('bad url');
        expect(content).to.be.undefined;
    });

    it('can set + get a gist', () => {
        const gist = makeGist();

        dispatcher.dispatch('set-gist', {
            url: gist.url,
            content: gist.content
        });

        const content = dispatcher.getStore(GistStore).getGist(gist.url);
        expect(content).to.equal(gist.content);
    });

    it('can set + set + get a gist', () => {
        const gist1 = makeGist(),
            gist2 = makeGist();

        dispatcher.dispatch('set-gist', {
            url: gist1.url,
            content: gist1.content
        });

        dispatcher.dispatch('set-gist', {
            url: gist1.url,
            content: gist2.content
        });

        const content = dispatcher.getStore(GistStore).getGist(gist1.url);
        expect(content).to.equal(gist2.content);
    });
});

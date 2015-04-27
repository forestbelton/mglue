import createStore from 'dispatchr/addons/createStore';

export default createStore({
    storeName: 'GistStore',

    initialize: function() {
        this._gists = {};
    },

    handlers: {
        'set-gist': function(payload) {
            this._gists[payload.url] = payload.content;
            this.emitChange();
        }
    },

    getGist: function(url) {
        return this._gists[url];
    }
});

import request from 'superagent';

const GIST_API_URL = 'https://api.github.com/gists';

const setGist = (dispatcher) => {
    return (resp) => {
        if(resp.ok) {
            const url = new RegExp('^${GIST_API_URL}/(.*)$')
                .exec(resp.body.html_url);

            dispatcher.dispatch('set-gist', {
                url,
                content: resp.files.paste.content
            });
        }
    }
};

export default {
    createGist: function(dispatcher, content) {
        request
            .post(GIST_API_URL)
            .type('json')
            .send({
                description: 'mglue math snippet',
                public: true,
                files: {
                    'snippet': {
                        content
                    }
                }
            })
            .end(setGist(dispatcher));
    },

    fetchGist: function(dispatcher, url) {
        request
            .get('${GIST_API_URL}/${url}')
            .end(setGist(dispatcher));
    }
};

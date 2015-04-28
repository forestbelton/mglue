import request from 'superagent';

const GIST_API_URL = 'https://api.github.com/gists';

const setGist = (dispatcher) => {
    return (err, resp) => {
        if(!err) {
            dispatcher.dispatch('set-gist', {
                url: resp.body.html_url.slice('https://gist.github.com/'.length),
                content: resp.body.files.paste.content
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
            .get(`${GIST_API_URL}/${url}`)
            .end(setGist(dispatcher));
    }
};

import React from 'react';
import GistActions from '../actions/GistActions';

export default class View extends React.Component {
    getGistStore() {
        return this.props.dispatcher.getStore('GistStore');
    }

    componentDidMount() {
        const gistStore = this.getGistStore(),
            url = this.context.router.getCurrentParams().url,
            content = gistStore.getGist(url);

        gistStore.addChangeListener(
            this._onGistChange.bind(this)
        );

        if(typeof content !== 'undefined') {
            this.setState({ content });
        } else {
            GistActions.fetchGist(this.props.dispatcher, url);
        }
    }

    componentWillUnmount() {
        this.getGistStore().removeChangeListener(
            this._onGistChange.bind(this)
        );
    }

    _onGistChange() {
        const url = this.context.router.getCurrentParams().url;

        this.setState({
            content: this.getGistStore().getGist(url)
        });
    }

    render() {
        return (
            <div>
                <p>Viewing a specific paste here</p>
                <hr />
                { this.state && this.state.content || '' }
            </div>
        );
    }
}

View.propTypes = {
    dispatcher: React.PropTypes.object
};

View.contextTypes = {
    router: React.PropTypes.func
};

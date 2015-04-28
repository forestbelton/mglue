import React from 'react';
import { Link } from 'react-router';

export default class Main extends React.Component {
    render() {
        return (
            <div>
                <p>Main view here</p>
                <Link to="/paste/15fc2100bd06d5a76efd">Link to a fake paste</Link>
            </div>
        );
    }
}

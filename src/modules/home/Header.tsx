import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

export interface IHeaderState {

}

export interface IHeaderProps {

}

export class Header extends React.Component<IHeaderProps, IHeaderState> {

    static contextTypes = {
        router: PropTypes.object
    };

    render() {
        return (
            <div className="header">
                <div className="tool-bar"></div>
            </div>
        );
    }
}

export default withRouter(Header);
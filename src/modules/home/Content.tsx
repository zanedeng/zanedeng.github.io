import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

export interface IContentState {

}

export interface IContentProps {

}

export class Content extends React.Component<IContentProps, IContentState> {

    static contextTypes = {
        router: PropTypes.object
    };

    render() {
        return (
            <div className="content">

            </div>
        );
    }
}

export default withRouter(Content);
import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

export interface IContentBottomState {

}

export interface IContentBottomProps {

}

export class ContentBottom extends React.Component<IContentBottomProps, IContentBottomState> {

    static contextTypes = {
        router: PropTypes.object
    };

    render() {
        return (
            <div className="content-bottom">

            </div>
        );
    }
}

export default withRouter(ContentBottom);
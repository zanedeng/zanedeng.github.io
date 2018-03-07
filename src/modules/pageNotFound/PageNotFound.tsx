import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import './PageNotFound.less';

export interface IPageNotFoundState {

}

export interface IPageNotFoundProps {
    history: any;
}

export class PageNotFound extends React.Component<IPageNotFoundProps, IPageNotFoundState> {

    static contextTypes = {
        router: PropTypes.object
    };

    render() {
        return (
            <div className="container">
                <h1>Page not found!!!</h1>
                <h3>
                    <a className="link" onClick={this.context.router.history.goBack} >Back</a>
                </h3>
            </div>
        );
    }
}

export default withRouter(PageNotFound);
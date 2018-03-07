import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

export interface IWorkspaceState {

}

export interface IWorkspaceProps {

}

export class Workspace extends React.Component<IWorkspaceProps, IWorkspaceState> {

    static contextTypes = {
        router: PropTypes.object
    };

    render() {
        return (
            <div></div>
        );
    }
}

export default withRouter(Workspace);
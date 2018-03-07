import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

export interface IRightSiderState {
    activeTabIndex: number;
}

export interface IRightSiderProps {

}

export class RightSider extends React.Component<IRightSiderProps, IRightSiderState> {

    static contextTypes = {
        router: PropTypes.object
    };

    constructor(props: IRightSiderProps) {
        super(props);
        this.state = {
            activeTabIndex: 0
        };
    }

    onTabClick(index: number) {
        this.setState({activeTabIndex: index});
    }

    render() {
        return (
            <div className="right-sider">
                <div className="panels-bar" style={{display: 'block'}}>
                    <div
                        onClick={() => this.onTabClick(0)}
                        className={'collab' +
                        ' panels-button' +
                        (this.state.activeTabIndex === 0 ? ' panels-button-down' : '')}>
                        技术交流
                        <div className="newnotifs" style={{display: 'none'}}></div>
                    </div>
                </div>
                <div
                    className="panel-bar"
                    style={{
                        zIndex: 100,
                        position: 'absolute',
                        left: 0,
                        right: this.state.activeTabIndex === 0 ? 34 : -240,
                        bottom: 0,
                        top: 0,
                        display: this.state.activeTabIndex === 0 ? '' : 'none'
                    }}></div>
            </div>
        );
    }
}

export default withRouter(RightSider);
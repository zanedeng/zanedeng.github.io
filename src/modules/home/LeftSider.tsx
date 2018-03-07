import React from 'react';
import { withRouter } from 'react-router';
import { Tabs } from 'antd';
import { Workspace } from './Workspace';
import PropTypes from 'prop-types';

export interface ILeftSiderState {
    activeTabIndex: number;
}

export interface ILeftSiderProps {

}

export class LeftSider extends React.Component<ILeftSiderProps, ILeftSiderState> {

    static contextTypes = {
        router: PropTypes.object
    };

    constructor(props: ILeftSiderProps) {
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
            <div className="left-sider">
                <div className="panels-bar" style={{display: 'block'}}>
                    <div
                        onClick={() => this.onTabClick(0)}
                        className={'workspace' +
                        ' panels-button' +
                        (this.state.activeTabIndex === 0 ? ' panels-button-down' : '')}>技术博文</div>
                    <div
                        onClick={() => this.onTabClick(1)}
                        className={'navigate' +
                        ' panels-button' +
                        (this.state.activeTabIndex === 1 ? ' panels-button-down' : '')}>源码收集</div>
                </div>
                <div
                    className="panel-bar"
                    style={{
                        zIndex: 100,
                        position: 'absolute',
                        left: this.state.activeTabIndex === 0 ? 34 : -240,
                        right: 0,
                        bottom: 0,
                        top: 0,
                        display: this.state.activeTabIndex === 0 ? '' : 'none'
                    }}></div>
                <div
                    className="panel-bar"
                    style={{
                        zIndex: 100,
                        position: 'absolute',
                        left: this.state.activeTabIndex === 1 ? 34 : -240,
                        right: 0,
                        bottom: 0,
                        top: 0,
                        display: this.state.activeTabIndex === 1 ? '' : 'none'
                    }}></div>
            </div>
        );
    }
}

export default withRouter(LeftSider);
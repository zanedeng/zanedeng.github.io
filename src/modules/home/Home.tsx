import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import SplitPane from 'react-split-pane';
import { LeftSider } from './LeftSider';
import { Content } from './Content';
import { ContentBottom } from './ContentBottom';
import { RightSider } from './RightSider';
import { Header } from './Header';

export interface IHomeState {

}

export interface IHomeProps {

}

export class Home extends React.Component<IHomeProps, IHomeState> {

    static contextTypes = {
        router: PropTypes.object
    };

    onSplitPaneSizeChange() {
        const resizeEvent = document.createEvent('HTMLEvents');
        resizeEvent.initEvent('resize', true, true);
        window.dispatchEvent(resizeEvent);
    }

    render() {
        return (
            <div className="home">
                <Header />
                <SplitPane
                    split="vertical"
                    minSize={34}
                    maxSize={300}
                    defaultSize={300}
                    onChange={this.onSplitPaneSizeChange}
                    style={{height: 'calc(100vh - 60px)'}}
                >
                    <LeftSider />
                    <SplitPane
                        split="vertical"
                        primary="second"
                        minSize={34}
                        maxSize={300}
                        onChange={this.onSplitPaneSizeChange}
                        defaultSize={300}
                    >
                        <SplitPane
                            split="horizontal"
                            primary="second"
                            minSize={100}
                            maxSize={600}
                            defaultSize={300}
                            onChange={this.onSplitPaneSizeChange}
                            pane1Style={{overflow: 'auto'}}
                        >
                            <Content />
                            <ContentBottom />
                        </SplitPane>
                        <RightSider />
                    </SplitPane>

                </SplitPane>
            </div>
        );
    }
}

export default withRouter(Home);
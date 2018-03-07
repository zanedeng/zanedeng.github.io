import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import DefaultValue from '../constants/DefaultValue';

export const lazyLoader = (importComponent: any) => (
    class AsyncComponent extends React.Component {
        static Component: any = null;
        state = { C: AsyncComponent.Component };

        async componentDidMount () {
            const { default: C } = await importComponent();
            this.setState({ C });
        }

        render () {
            const { C } = this.state;
            return C ? React.createElement(C, this.props) : null;
        }
    }
);

const Home  = lazyLoader(() => import('./home/Home'));
const PageNotFound  = lazyLoader(() => import('./pageNotFound'));

/**
 * @interface IRootRouterState
 */
export interface IRootRouterState {

}

/**
 * @interface IRootRouterProps
 */
export interface IRootRouterProps {

}

/**
 *
 * @param state
 */
const mapStateToProps = (state: any) => ({

});

/**
 *
 * @type {*}
 */
const mapDispatchTpProps = {

};

/**
 * 路由
 */
export class RootRouter extends React.Component<IRootRouterProps, IRootRouterState> {

    render () {
        return (
            <Router forceRefresh={true}>
                <Switch>
                    <Route exact={true} path={`${DefaultValue.BASE_ROUTE_URL}/`} render={() => (
                        <Home />
                    )} />
                    <Route path="/*" component={PageNotFound} />
                </Switch>
            </Router>);
    }
}

export default connect(mapStateToProps, mapDispatchTpProps)(RootRouter);
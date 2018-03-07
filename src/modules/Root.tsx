import * as React from 'react';
import { Provider } from 'react-redux';
import createStore from '../reducers/store';
import RootRouter from './RootRouter';

const store = createStore();

export default class Root extends React.Component {

    render () {
        return (
            <Provider store={store}>
                <RootRouter />
            </Provider>
        );
    }
}
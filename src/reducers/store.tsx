import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import Perf from 'react-addons-perf';
import { userKey, userReducer } from './userReducer';

const win: any = window;
win.Perf = Perf;

const middlewares = [
    thunk
];

const storeEnhancers = compose(
    applyMiddleware(...middlewares),
    (win && win.devToolsExtension) ? win.devToolsExtension() : (f: any) => f,
);

export default () => {
    const rootReducer = combineReducers({
        [userKey]: userReducer
    });
    const store = createStore(rootReducer, storeEnhancers);
    return store;
};
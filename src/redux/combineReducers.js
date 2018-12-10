import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import usersReducer from './reducers/usersReducer';
import postsReducer from './reducers/postsReducer';

const rootReducer = combineReducers({
    usersState: usersReducer,
    postsState: postsReducer
});

let middleware = [applyMiddleware(thunk)];

if (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__) {
    middleware.push(window.__REDUX_DEVTOOLS_EXTENSION__());
}

export function configureStore() {
    if (typeof window !== 'undefined') {    
        return createStore(
            rootReducer, 
            compose(...middleware)
        );
    }
}


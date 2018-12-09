import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import usersReducer from './reducers/usersReducer';
import postsReducer from './reducers/postsReducer';

const rootReducer = combineReducers({
    usersState: usersReducer,
    postsState: postsReducer
});

export function configureStore() {
    if (typeof window !== 'undefined') {    
        return createStore(
            rootReducer, 
            compose(
                applyMiddleware(thunk),
                window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
            )
        );
    }
}


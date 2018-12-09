import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import usersReducer from './reducers/usersReducer';

const rootReducer = combineReducers({
    usersState: usersReducer
});
const middleware = compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export function configureStore() {
    if (typeof window !== 'undefined') {    
        return createStore(
            rootReducer, 
            middleware
        );
    }
}


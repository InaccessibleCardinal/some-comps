# Day Four: Introduction to Redux

**Lifting Up State**

Consider the following psuedo-component:
```
//MemberInformation.js
export default class MemberInformation extends React.Component {
    //state and methods...
    render() {
    //collect some variables to pass to child components...
        return (
            <div>
                <NameDisplay {...nameData} />
                <TaxInfo {...ssnData} />
                <AccountsList {...accountData} />
                <BeneficiariesList {...beneficiaryData} />
                ...other stuff
            </div>
        );
    }
}
```
Judging by `MemberInformation`'s child components, it looks like `MemberInformation` needs at least 3 data sources: member data, account data and beneficiary data. The typical strategy is to put such data in the state of the closest parent component. This strategy is as old as React and there's nothing wrong with it. But what if we end up using `MemberInformation` in an app like this:
```
//App.js
//...imports
export default class App extends React.Component {
    state = {/*some state stuff*/};
    ...etc
    render() {
        return (
            <div>
                <Header />
                <Navigation />
                <SideBar />
                <MemberInformation />
                ...some other components...?
                <Footer />
            </div>
        )
    }
}
```
Let's say we find out that `Header` also needs the member's data because there's a little component in the header that says "hello" to the member by name. We also discover that `Navigation` needs to know about the member and accounts because there are special links that are based on the logged in person's preferences. Then we find out that `Sidebar` is supposed to have a message warning the member about any possible tax problems. Maybe the `Footer` doesn't care about all these data, but it's conceivable that many components outside `MemberInformation` would. What to do?

We could use our "lift up state to the closest parent component" axiom, but then all the data would be where...in `App`'s state? If your app is simple enough, this may do, but this imaginary app is starting to sound complex, with lots of components needing to know about lots of data. `App` is the top level component, so if we "lift up the state" any higher it would be *outside the components*. Is that even allowed? Yep, Redux will do this very thing.

**The Redux Store**

The basic idea of Redux is to delegate state updates to an external object called the `store` and then give components an api to subscribe to those updates. If that sounds like a "publisher-subscriber" pattern to you, you're thinking correctly. 

If you create a store and inspect it in the console, you'll see that it's an object with a few public methods: `getState`, `subscribe`, `dispatch` and `replaceReducer` (we won't talk about the last one yet). You could imagine the store object looking like this:
```
{
    currentState: {
        /*
        ...your application data. 
        This is not directly exposed. It lives inside the createStore function.
        The only way to read it is with 'getState'.
        The only way to change it is with 'dispatch'.
        */
    },
    getState: function() {
        /*
        returns currentState.
        */
    },
    subscribe: function(listener) {
        /*
        listeners are callback functions used to notify
        "subscribers" of state updates. The Provider component
        has such a listener in its own "subscribe" method.
        */
    },
    dispatch: function(action) { 
        /*
        An action is an object with a "type" property (at least).
        This method tells the store reducer to update currentState 
        based on the action, then it envokes each subscribing listener.
        */
    },
    reducer: function(state, action) {
        /*
        A pure function that updates currentState.
        YOU define this.
        */
    }
    
}
```
Not much to it, and the simplicity is charming once you see how useful it can be. So, how do we use this little "state machine" gizmo? A few of things need to happen for it all to work. 

* We need at least one reducer function.
* We need to create the `store` object.
* We need to provide the store to our app.
* We need to connect a component to the `store`.

By convention, one tends to put the Redux specific code in a directory called 'redux'. The way you organize your modules is up to you, but we'll follow some common conventions. Inside the "redux" directory we'll make a folder called "actions" and a folder called "reducers":
```
-src/
...your other modules
    -redux/
        -actions/
        -reducers/
```
The "actions" directory will contain functions called "action creators". We won't worry about these yet because, strictly speaking, they aren't necessary to integrate with Redux. The "reducers" directory will contain your reducer functions. Inside src/redux/reducers/ create a file called "counterReducer.js". Yes, another counter app...it's the "Hello World" of React/Redux maybe...
```
//FILE: src/redux/reducers/counterReducer.js
const initialState = {value: 0}; 
/*
For each reducer, start with an "initialState". 
We will see in a bit that this "primes the pump" when you use the createStore function exported from redux.
*/
export default function counterReducer(state = initialState, action) {
    /*
    "state = initialState" as a parameter means "use the state value, 
    or if that's undefined, fallback on the initialState value". 
    It's not unique to JavaScript. 
    The action will be an object that looks like {type: SOME_STRING}, 
    where SOME_STRING will be 'ADD' or 'SUBTRACT'.
    */ 
    return state; 
    //What?! This is fine for now. It's a reducer that does nothing.
}
```
It's important to point out that your *reducer functions must be pure*, that is *without side-effects*. A reducer takes `state` and an action as arguments and updates the store state, nothing more. So don't make network calls in a reducer or manipulate anything other than state, and don't dispatch an action from a reducer (try it, Redux will yell at you).

Now that we have a reducer, in the src/redux folder, create a file called "store.js", import your `counterReducer` and import `createStore` from Redux:
```
//FILE: src/redux/store.js
import {createStore} from 'redux';
import counterReducer from './reducers/counterReducer';
export default createStore(counterReducer);
/*
createStore takes, at minimum, a reducer as argument. 
This is your store.
*/
```
Now that we have a `store`, we need to provide it to our application. Go to the entry point of your app, main.js, and do this:
```
//FILE: src/main.js
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'; 
/*
import the Provider component. Provider will subscribe to the store.
Provider takes the store as a prop and takes your App component as a child.
*/
import store from './redux/store'; //you also need your store

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('root')
);
```
Finally, we need to connect a component to the `store`. Let's just do it with `App` for simplicity:
```
//FILE: src/App.js
import React, {Component} from 'react';
import {connect} from 'react-redux';
/*
connect will wrap your component and pass store data as props to it.
*/

class App extends Component {
    add = () => {
       //TODO: use this to dispatch an 'ADD' action.
    }
    subtract = () => {
        //TODO: use this to dispatch a 'SUBTRACT' action.
    }
    render() {
       //TODO: read counter from this.props
        return (
            <div>
                <button onClick={this.add}>ADD</button>
                <button onClick={this.subtract}>SUBTRACT</button>
                <h1>Value: ...we'll put the value of the counter here</h1>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        counter: state
    };
}
export default connect(mapStateToProps)(App);
```
There are couple new things here to explain. 

`mapStateToProps`: This is a function you define that maps state to whatever prop key/s you want to use in your component. Giving the prop the same name it has on the state is common. The state argument in `mapStateToProps(state)` is injected by `connect`. Often times you will want several things from the state, in which case you can destructure:
```
//mapStateToProps example
function mapStateToProps(state) {
    let {stateThing1, ..., stateThing_n} = state;
    return {stateThing1, ..., stateThing_n};   
}
```
For our counter, we'll just put the counter object `{value: n}` on a prop called `counter`.

`connect` is a function that takes your mapStateToProps as argument and returns a function of your component. In very simplified psuedo-code you might picture connect looking like:
```
//hand-wavy connect
    function(mapStateToProps) {
        return function(YourComponent) {
            return class extends Component {
                /*
                React-Redux uses an api called "context" to facilitate communication between
                Provider and this component. The store lives in that context, this component
                consumes it and uses your mapStateToProps to pluck out the pieces of state
                your component wants.
                */
                render() {
                    return (
                        <YourComponent {...propsYouMappedFromStoreState} />
                    );
                }
            }
        }
    }
```
The actual situation involves a lot more "wrapping" and indirection, but this is the basic idea. Remember, we saw this `connect(mapStateToProps)(App)` syntax before on day-one when we used it to decorate DOM elements with event handlers, styles, extra children and such. So one upshot of this lesson is that React components themselves can be wrapped and decorated in a similar way, by using functions that return components or return functions of components. The result of this pattern is called a "higher-order component".

Now that our component is connected, let's revisit our reducer that does nothing and make it do something.
```
//FILE: src/redux/reducers/counterReducer.js
const initialState = {value: 0}; 

export default function counterReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD': {
            return {...state, value: state.value + 1};
        }
        case 'SUBTRACT': {
            return {...state, value: state.value - 1};
        }
        default: {
            return state;
        }
    }
}
```
Notice that in the cases that handle the actions `{type: 'ADD'}` and `{type: 'SUBTRACT'}`, we return *a copy* of the state. This is necessary because `Provider` and `connect` do shallow equality checks to determine if your store state has changed. It would be too expensive for `Provider` and `connect` to do deep equality checks each time an action is dispatched. Also notice that we have a `default` case in our switch statement. You should use switch like this anyway, but you'll definitely need it in your reducer functions because the last thing `createStore` does before returning the store object is dispatch an "INIT" action, which is designed to fall through your reducers and initialize the store with your `initialState`s.

All that is left for us to do is to dispatch the actions. Back in App:
```
//FILE: App.js
...etc
class App extends Component {
    add = () => {
       this.props.dispatch({type: 'ADD'});
    }
    subtract = () => {
       this.props.dispatch({type: 'SUBTRACT'});
    }
    render() {
       let {counter} = this.props;
        return (
            <div>
                <button onClick={this.add}>ADD</button>
                <button onClick={this.subtract}>SUBTRACT</button>
                <h1>Value: {counter.value}</h1>
            </div>
        );
    }
}
...etc mapState and exporting connect(mapState)(App)
```
By default, `connect` will give your component the `dispatch` function as a prop, and it can be invoked with the actions `{type: 'ADD'}` and `{type: 'SUBTRACT'}`. The counter now works. In a real application we'll probably want to delegate the dispatching of actions to "action creators" in our "actions" directory, and we'll discuss this approach next time.

So all together you should have this:
```
//FILE: src/redux/reducers/counterReducer.js
const initialState = {value: 0};
export default function counterReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD': {
            return {...state, value: state.value + 1};
        }
        case 'SUBTRACT': {
            return {...state, value: state.value - 1};
        }
        default: {
            return state;
        }
    }
}

//FILE: src/redux/store.js
import {createStore} from 'redux';
import counterReducer from './reducers/counterReducer';
export default createStore(counterReducer);

//FILE: src/main.js
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'; 
import store from './redux/store'; //you also need your store

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('root')
);

//FILE: src/App.js
import React, {Component} from 'react';
import {connect} from 'react-redux';
class App extends Component {
    add = () => {
       this.props.dispatch({type: 'ADD'});
    }
    subtract = () => {
       this.props.dispatch({type: 'SUBTRACT'});
    }
    render() {
       let {counter} = this.props;
        return (
            <div>
                <button onClick={this.add}>ADD</button>
                <button onClick={this.subtract}>SUBTRACT</button>
                <h1>Value: {counter.value}</h1>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        counter: state
    };
}
export default connect(mapStateToProps)(App);
```
Next time we will look at action creators, combining multiple reducers into one store reducer, asynchronous actions and middleware.
# Day Five: More on Redux
When we started out our store.js looked something like this:
```javascript
//store.js
import {createStore} from 'redux';
import usersReducer from './reducers/usersReducer';
export default createStore(usersReducer);
```
The store state had the following shape:
```javascript
{
    users: [...],
    usersLoading: false,
    usersError: null,
    selectedUserId: null
}
```
**Multiple reducers**

The entire state object was managed by the single `usersReducer`. But, we're also going to need to manage some state for "posts", and as the app grows we may need to expand things further. Redux exports a utility function called `combineReducers` that lets us handle this situation. Let's use it:
```javascript
//store.js
import {createStore, combineReducers} from 'redux';
import usersReducer from './reducers/usersReducer';
import postsReducer from './reducers/postsReducer';
export default createStore(
    combineReducers({
        usersState: usersReducer,
        postsStateL postsReducer
    })
);
```
If that nesting bothers your eyes, the following is equivalent and maybe clearer:
```javascript
//store.js
import {createStore, combineReducers} from 'redux';
import usersReducer from './reducers/usersReducer';
import postsReducer from './reducers/postsReducer';

const reducerFuncs = {usersState: usersReducer, postsState: postsReducer};
const rootReducer = combineReducers(reducerFuncs);
export default createStore(rootReducer);
```
`combineReducers` is not magical - it defines a new function of `state` and an `action`, takes your "config" `reducerFuncs` and gives control of `state[key]` to `reducerFuncs[key]` (which is a function). So now your store state will have a couple branches:
```javascript
{
    usersState: //whatever your usersReducer says it is
    postsState: //whatever your postsReducer says it is
}
```
So, rather like `createStore`, `combineReducers` doesn't **do** much, it just organizes the state management into branches or slices. We saw a way to do this in class using `reduce` that took 7 lines of code.

Now in your components you can use `mapStateToProps` like this:
```javascript
//Some component that wants users and posts
//...etc.
function mapStateToProps(state) {
    let {usersState, postsState} = state;
    return {usersState, postsState};
}
export default connect(mapStateToProps)(MyComponent);
```
****
**Lifecycle & Redux**
In our `Posts.js` component (branch `day-four-solution-2`) We were able to leverage a lifecycle method we hadn't seen before, namely `componentDidUpdate`. The component started out like this:
```javascript
class Posts extends Component {
    componentDidMount() { 
    /*
    In didMount we make the service call to get a user's posts, which in turn dispatches an action
    that puts the posts in our postsState.posts
    */
        let {dispatch, userId} = this.props; 
        //userId comes from the parent component
        //dispatch, of course, comes from connect
        getPosts(dispatch, userId); 
    }
    
    render() {
        //some code that maps a list of posts to a list of <Post /> components
    }
}
```
The trouble is, what can our component do when the parent component selects a new user? In the UI, we saw that the user info was updated, but the new user's posts did not show up. Well, we are only getting a user's posts in `componentDidMount`, which only happens once. We *could* unmount and remount the component each time a new user is selected, but we won't because that's dumb. Enter `componentDidUpdate`:
```javascript
class Posts extends Component {
    componentDidMount() {
        let {dispatch, userId} = this.props;
        getPosts(dispatch, userId); 
    }
    componentDidUpdate(previousProps/*, previousState*/) {
        let {userId: currentUserId, dispatch} = this.props;
        let {userId: previousUserId} = previousProps;
        if (currentUserId !== previousUserId) {
            getPosts(dispatch, currentUserId);
        }
    }
    //...etc
```
`componentDidUpdate` takes `previousProps` and `previousState` as parameters, and also has access to the current values of  `this.props` and `this.state`. There's no `state` in our Posts component, so we omit that parameter (I have it commented out to remind you that it's available if you need it). The idea is that each time `Posts`'s props are updated, this method will fire and you can write some logic that compares previous values with current values, and if your condition(s) is(are) met, you can dispatch an action, set state, do whatever you need to do. So above, if `currentUserId !== previousUserId` is met, we'll getPosts with respect to the current user.

What we have is almost right, but we notice that each time a new user is selected, `getPosts` is being fired, regardless of whether our redux store already has that user's posts. We'd rather not repeat that network call if we already have the data, so we add one more condition in `componentDidUpdate`:
```javascript
//...etc
    componentDidUpdate(previousProps) {
        let {userId: currentUserId, dispatch} = this.props;
        let {userId: previousUserId, postsState} = previousProps;
        let {posts: previousPosts} = postsState;
        if (currentUserId !== previousUserId) {
            if (!previousPosts[currentUserId]) { 
            //check if the newly selected user's posts don't already exist in the store
                getPosts(dispatch, currentUserId);   
            }
        }
    }
//...etc
```
Now the posts will update in the UI, but our app will only make a network call when it needsdata it doesn't have yet.

**Warning About componentDidUpdate**

You'll want to make sure your logic inside `componentDidUpdate` doesn't use a condition that can be satisfied over and over again. For example, the following will almost certainly break an application:
```
componentDidUpdate(previousProps) {
    if (this.props.userIsLoggedIn) {
        //dispatch an action / setState for a logged in member
    }
}
```
You should be comparing `previousProps` to current `props`, and you should *make sure that your condition can only be met exactly when you want it to*. If you don't, you'll get infinite loops. React will either shut your app down (versions 16+) or the app will freeze as the JS stack overflows (older versions). This warning applies to `componentWillUpdate` and the deprecated `componentWillReceiveProps` as well.


****

**Derived Values From State**

We touched on a technique that can be used inside our `mapStateToProps` functions. Let's say we have a component that needs a "selected user" object, but doesn't need anything else from the `usersState`. There was no "selectedUser" property on our state, we only had `users` and `selectedUserId`:
```
//usersState
{
    users: [
    ...some users
        {username: 'Sammy', id: 'sammy123', ...other stuff },
    ...some other users
    ],
    selectedUserId: 'sammy123',
    ...other stuff
}
```
We *could* add a "selectedUser" property to our `usersState` and use it instead of the `selectedUserId`, but then our state would look something like this:
```
//usersState drafted by the department of redundancy department
{
    users: [
    ...some users
        {username: 'Sammy', id: 'sammy123', ...other stuff },
    ...some other users
    ],
    selectedUser: {username: 'Sammy', id: 'sammy123', ...other stuff },
    ...other stuff
}
```
Which means that we have duplicated data in our state. *You can do this sort of thing*, but it doesn't get points for being economical and you certainly wouldn't want to do it a lot. If you'd like to avoid these kinds of redundancies, you can play a little trick inside `mapStateToProps`. It's not a tall order to *compute* or *derive* the `selectedUser` object if you already know the `users` and the `selectedUserId`:
```javascript
//define a function that computes the property you want
function getSelectedUser(state) {
    let {users, selectedUserId} = state.usersState;
    return users.find(u => u.id === selectedUserId);
}
//then use it in your state mapper:
function maptateToProps(state) {
    return {
        ...any other props you care about
        selectedUser: getSelectedUser(state),
        ...any other props you care about
    };
}
```
Functions like `getSelectedUser` in Redux are called "selectors", and they can keep your store structure simple. 

**However, there is a caveat**: `mapStateToProps` is invoked every time `connect` gets updated props, and if the computation you are running in your selector function is complex, this can cause performance problems. Even in the above example, `users.find(u => u.id === selectedUserId)` is not without its own cost. `find` is a loop that will run up to `users.length` many times. If you have 100,000 users and the user you are trying to `find` happens to show up early in the list, great, but if he's number 99,999, not so great. Redux has a library called [reselect](https://github.com/reduxjs/reselect) that can help make selectors more performant by memoizing them in various ways. If you are going to use selectors often, reselect is probably a good idea.










import React from 'react';
//Teaching examples...

//import Images from './components/SimpleExample';
//import ShowHide from './components/ShowHide';
//import {Life1, Life2} from './components/LifeCycle';
//import {NetworkRequest1, NetworkRequest2, NetworkRequest3} from './components/NetworkRequest';
//import {MemberInfo, renderAddress, member} from './components/renderFunctions';
//import {A, B} from './components/renderHijack';
// import {
//     withService,
//     ShowPosts, 
//     ShowUsers, 
//     WrappedSample,
//     Menu,
//     withShowHide
// } from './components/hocExample';
//some redux:
// import UsersWithRedux from './containers/UsersWithRedux';
// import PostsWithRedux from './containers/PostsWithRedux';

//const Users = withService(ShowUsers, {dataName: 'users'}, 'https://jsonplaceholder.typicode.com/users')
// const Posts = withService(ShowPosts, {dataName: 'posts'}, 'https://jsonplaceholder.typicode.com/posts')
//let TogglingMenu = withShowHide(Menu);

import ContextExample from './components/ContextExample';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            a: 42,
            b: [1, 2, 3],
            c: 'some string',
            updateContext: this.updateContext
        }; 
    }
    updateContext = () => {
        this.setState({a: this.state.a + 1}, () => console.log('check: ', this.state));
    }
    render() {
        return (
            <div>
                <ContextExample {...this.state} updateContext={this.updateContext} />
            </div>
        );
    }
}



/*for Life1 example

    state = {showingLifeComponent: true};
    unmountLifeComponent = () => this.setState({showingLifeComponent: false});

    render() {
        let {showingLifeComponent} = this.state;
        return (
            <div>
                <button onClick={this.unmountLifeComponent}>End Life</button>
                {showingLifeComponent && <Life1 />}
            </div>
            
        );
    }

*/

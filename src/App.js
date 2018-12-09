import React from 'react';
//import Images from './components/SimpleExample';
//import ShowHide from './components/ShowHide';
//import {Life1, Life2} from './components/LifeCycle';
//import {NetworkRequest1, NetworkRequest2, NetworkRequest3} from './components/NetworkRequest';
//import {MemberInfo, renderAddress, member} from './components/renderFunctions';
//import {A, B} from './components/renderHijack';
//import {listWithDataService, ListFromData} from './components/hocExample';
//some redux:
import UsersWithRedux from './containers/UsersWithRedux';

export default class App extends React.Component {

    render() {
        
        return (
            <UsersWithRedux />      
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

/*for hoc example
    render() {
        const usersConfig = {
            keysDesired: ['name', 'username', 'email'],
            url: 'https://jsonplaceholder.typicode.com/users'
        };
        const postsConfig = {
            keysDesired: ['title', 'body'],
            url: 'https://jsonplaceholder.typicode.com/posts'
        };
        const Users = listWithDataService(ListFromData, usersConfig);
        const Posts = listWithDataService(ListFromData, postsConfig);
        return (
            <div>
                <div style={{display: 'flex'}}>
                    <Users />
                    <Posts />
                </div>
            </div>
        );
    }


*/
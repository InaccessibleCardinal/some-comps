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

//import ContextExample from './components/ContextExample';
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            error: null,
            other: 42
        }; 
    }
    componentDidMount() {
        let u = 'https://jsonplaceholder.typicode.com/users';
        let c = {
            url: u, 
            method: 'GET'
        };
        request(c)(this.getData.bind(this));
    }
    getData(r) {
        let {data, error} = r;
        if (data) {
            this.setState((state) => state.data = data);
        } else if (error) {
            this.setState((state) => state.error = error);
        }
        
    }
    render() {
        let {data, error} = this.state;
        return (
            <div>
                {data && <p>{data[0].name}</p>}
                {error && <p>{error}</p>}
            </div>
        );
    }
}

const machine = {
    dispatch: function(actionName, ...payload) {
        const actions = this.transitions[this.state];
        const action = actions[actionName];
  
        if (action) {
            action.apply(machine, payload);
        }
    },
    changeStateTo: function(newState) {
        this.state = newState;
    },
    state: 'idle',
    transitions: {
        'idle': {
            click: function () {
                this.changeStateTo('fetching');
                let c = {url: 'https://jsonplaceholder.typicode.com/users', method: 'GET'};
                request(c)((d) => {
                    console.log('logging', d)
                    this.dispatch('success', d);
                });    
            }
        },
        'fetching': {
            success: function (data) {
                console.log('inside fetching...')            
                this.changeStateTo('idle');
            },
            failure: function (error) {
                this.changeStateTo('error');
            }
        },
        'error': {
            retry: function () {
                this.changeStateTo('idle');
                this.dispatch('click');
            }
        }
    }
}

machine.dispatch('click');





//
function request(config) {

    let {url, method, headers} = config;
    let fn;
    function setHeaders(req, headers) {
        headers.forEach((h) => {
            req.setRequestHeader(h.name, h.value);
        });
    }

    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    if (headers) {
        setHeaders(xhr, headers);
    }
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status < 399) {
                //success
                if (fn) {
                    fn({data: JSON.parse(xhr.responseText)});
                }
            } else {
                //failure
                if (fn) {
                    fn({error: `Request failed with  status: ${xhr.status}`});
                }   
            }
        }
    }

    if (config) {
        xhr.send(config.body);
    } else {
        xhr.send();
    }

    return function(callback) {
        fn = callback;
    }
}
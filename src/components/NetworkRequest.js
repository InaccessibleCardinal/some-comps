import React from 'react';
//async processes
//network requests & promises

export class NetworkRequest1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {users: []};
    }
    componentDidMount() {
        const url = 'https://jsonplaceholder.typicode.com/users';
        makeRequest(url, this.setState.bind(this)); //lol don't do this
    }
    render() {
        let usersMarkup = this.state.users.map((u) => {
            return (
                <p key={u.id}>{u.name}</p>
            );
        });
        return (
            <div>
                <h1>Users: </h1>
                {usersMarkup}
            </div>
        );
    }
}

function makeRequest(url, callback) { 
    //this is just a bad api for our component
    let x = new XMLHttpRequest();
    x.open('GET', url);
    x.onreadystatechange = () => {
        if (x.readyState === 4) {
            if (x.status < 399) {
                let o = {users: JSON.parse(x.responseText)};
                callback(() => o); //yes setState can take a function...btw
            } else {
                throw new Error(`Request failed with status: ${x.status}`);
            }
        }
    }
    x.send();
}

//Enough of that
//How to improve it? How about promises? Little preview of a module pattern too...
function haxiosMaker() {

    function _makeRequest(config) { //internal to the module, inaccessible to outside code
        let {method, url, body} = config;
        return new Promise((resolve, reject) => { 
            //use a promise
            //same old xhr api inside the function
            //our new api will hide this old api b/c no one wants to see it
            let x = new XMLHttpRequest();
            x.open(method, url);
            x.onreadystatechange = () => {
                if (x.readyState === 4) {
                    if (x.status < 399) { 
                        //on success we resolve
                        resolve(JSON.parse(x.responseText));
                    } else {
                        let e = {
                            message: `Request failed with status: ${x.status}`,
                            responseHeaders: x.getAllResponseHeaders() 
                        };
                        //on error we reject
                        reject(e);
                    }
                    
                }
            }
            
            if (typeof body !== 'undefined') {
                x.send(body);
            } else {
                x.send();
            }
        }); 
    }

    return { //public api
        get: function(url) {
            let config = {url, method: 'GET'};
            return _makeRequest(config);
        },
        post: function(url, body) {
            let config = {url, body, method: 'POST'};
            return _makeRequest(config);
        }
    };
}

const haxios = haxiosMaker(); // network calls can use this instead of xhr

export class NetworkRequest2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {users: [], error: null};
    }
    componentDidMount() {
        const url = 'https://jsonplaceholder.typicode.com/users';
        haxios.get(url)
            .then((data) => {
                this.setState({users: data});
            })
            .catch((e) => {
                this.setState({error: e.message});
            });
    }
    render() {
        let {error, users} = this.state;
        let usersMarkup = users.map((u) => {
            return (
                <p key={u.id}>{u.name}</p>
            );
        });
        return (
            <div>
                <h1>Users: </h1>
                {usersMarkup}
                {error && <p>{error}</p>}
            </div>
        );
    }
}

//What about multiple requests?
//Promise.all
export class NetworkRequest3 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: true, posts: [], error: null};
    }

    componentDidMount() {

        const url = 'https://jsonplaceholder.typicode.com/posts/';
        let requests = [];
        for (let i = 1; i < 100; ++i) {
            let u = url + i;
            let p = new Promise((resolve, reject) => {
                haxios.get(u)
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((e) => {
                        reject(e.message);
                    });
            });
            requests.push(p);
        }
        Promise.all(requests)
            .then((values) => {
                this.setState({loading: false, posts: values});
            })
            .catch((e) => {
                console.log(e);
                this.setState({loading: false, error: 'Fail'});
            });
        
        
    }

    //depending on your Babel...you might have this as well
    async getTodos() {
        return await haxios.get('https://jsonplaceholder.typicode.com/todos');
        //usage:
        //this.getTodos().then((d) => console.log('todos: ', d));
        //that's it
    }

    render() {
        let {loading, posts, error} = this.state;
        let postsMarkup = posts.map((p) => {
            return (
                <p key={p.id}>{p.title}</p>
            );
        });
        if (loading) {
            return (
                <p>Loading...I'm a spinner...</p>
            );
        } else {
            return (
                <div>
                    <h1>Posts: </h1>
                    {postsMarkup}
                    {error && <p>{error}</p>}
                </div>
            );
        }

    }
}

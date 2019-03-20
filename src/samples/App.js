import React from 'react';
//import Accordion from './Accordion';
//import Counter from './Counter';
import axios from 'axios';

export default class App extends React.Component {

    state = {users: [], loading: true, errorMessage: ''};

    componentDidMount() {
        this.getTodos();
        getUsersThenPosts()
            .then(({responses}) => {
                
                responses.then((data) => {
                    let {users, posts} = data;
                    let usersWithPosts = users.map((user) => {
                        return {
                            ...user,
                            userPosts: posts.filter((post) => post.userId === user.id)
                        };
                    });

                    this.setState({users: usersWithPosts, loading: false});

                }); 
            });
    }

    async getTodos() {
        let todos = await makeGetRequest('https://jsonplaceholder.typicode.com/todos');
        console.log('TODOS! ', todos.data);
    }

    render() {    
        let {users, loading, errorMessage} = this.state;

        return (
            <div>
                {users.length ?
                    <UsersList users={users} />
                    :
                    <p>{errorMessage}</p>
                }
               <Loader isActive={loading} />
            </div>
        );
    }
}


function Loader({isActive}) {
    if (isActive) {
        return (
            <div className="loader-container">
                <div className="loader" />
            </div>
        )
    } else {
        return null;
    }
}

function UsersList({users}) {
    let usersMarkup = users.map((u) => {
        return (
            <li key={u.id}>
                <UserCard user={u} />
            </li>
        );
    });

    return (
        <ul style={{listStyle: 'none', margin: 0, padding: 0}}>
            {usersMarkup}
        </ul>
    );
}

function UserCard({user}) {
    let {id, name, username, email, phone, website, userPosts} = user;

    return (
        <div style={{border: '1px solid', padding: '15px'}}>
            <h2>User {id}: </h2>
            <h3>Name: {name}</h3>
            <p>Username: {username}</p>
            <p>E-Mail: {email}</p>
            <p>Phone: {phone}</p>
            <p>Website: {website}</p>
            <hr />
            <UserPosts posts={userPosts} />  
        </div>
    );

}

function UserPosts({posts}) {
    
    let postsMarkup;
    if (posts.length) {
        postsMarkup = posts.map((p) => {
            let {id, title, body} = p;
            return (
                <li key={id}>
                    <h4>{title}</h4>
                    <p>{body}</p>
                </li>
            );
        });
    } else {
        postsMarkup = <p>There was an error getting this user's posts.</p>
    }
    return (
        <div>
            <h3>User Posts:</h3>
            <ul style={{listStyle: 'none'}}>
                {postsMarkup}   
            </ul>
        </div>
    );
}

function makeGetRequest(url) {
    return axios.get(url);
}

function getUsersThenPosts() {
    let usersUrl = 'https://jsonplaceholder.typicode.com/users';
    let postsUrlRoot = 'https://jsonplaceholder.typicode.com/posts';
    let users;

    function thunkAll(promiseArray, users) {
        let payload = {users, posts: []};
        return Promise.all(
                promiseArray.map((p) => {
                    return p.then((r) => r.data).catch((e) => e);   
                })
            ).then((values) => {
                return values.reduce((acc, curr) => {

                payload.posts = payload.posts.concat(curr)
                return payload;
                
            }, payload);
        });
        
    }

    return new Promise((resolve, reject) => {

        makeGetRequest(usersUrl)
            .then((r) => {
                
                let {data} = r;
                users = data;
                let postsPromises = data.map((user, i) => {
                    let postsUrl = `${postsUrlRoot}?userId=${user.id}`;
                    if (i === 3 || i === 1) {
                        postsUrl = 'x';
                    }
                    return makeGetRequest(postsUrl);
                });

                resolve({
                    responses: thunkAll(postsPromises, users)   
                });
                
            }).catch((e) => {
                reject(e);
            })
    });
}



import React from 'react';
//import Accordion from './Accordion';
//import Counter from './Counter';
import axios from 'axios';

export default class App extends React.Component {

    state = {users: [], loading: true, errorMessage: ''};

    componentDidMount() {
        //make svc call by using
        
    getUsersThenPosts()
    .then((result) => {
        
        let {users, posts: p} = result;
        console.log('users: ', p)
        

    })
    .catch((e) => console.log(e))

    

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
    let {id, name, username, email, phone, website} = user;

    return (
        <div style={{border: '1px solid', padding: '15px'}}>
            <h2>User {id}: </h2>
            <h3>Name: {name}</h3>
            <p>Username: {username}</p>
            <p>E-Mail: {email}</p>
            <p>Phone: {phone}</p>
            <p>Website: {website}</p>
            <hr />
            <UserPosts />  
        </div>
    );

}

function UserPosts({posts}) {
    return (
        <div>
            <h3>User Posts:</h3>
            <ul>
                <li>Posts will go in here</li>    
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

    function thunkAll(promiseArray) {
        return Promise.all(
                promiseArray.map((p) => {
                    return p.then((r) => r.data).catch((e) => e);   
                })
            )
            .then((values) => values).catch((e) => e);
    }

    return new Promise((resolve, reject) => {

        makeGetRequest(usersUrl)
            .then((r) => {
                let {data} = r;
                users = data;
                let postsPromises = data.map((user, i) => {
                    let postsUrl = `${postsUrlRoot}?userId=${user.id}`;
                    return makeGetRequest(postsUrl);
                });

                resolve({
                    users,
                    posts: thunkAll(postsPromises)
                   
                })
                
            }).catch((e) => {
                reject(e);
            })
    });
}
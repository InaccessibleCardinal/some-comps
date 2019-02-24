import React, {Component} from 'react';
import axios from 'axios';

export default class NetworkRequests extends Component {
    state = {
        users: null,
        loading: true
    };
    componentDidMount() {
        this.getData();

        let url = 'https://jsonplaceholder.typicode.com/users';

        let usersPromises = [];
        makeGetRequest(url).then((r) => {

            let {data} = r;
            data.forEach((user, index) => {
                let {id} = user;
                if (index === 4) {
                    id = 'abc';
                }
                usersPromises.push(makeGetRequest(`${url}/${id}`));
            });

            Promise.all(usersPromises.map((p) => {
                return p.catch((e) => {
                    return e;
                });
            }))
            .then((values) => {
                console.log('values: ', values);
                let users = values.map((v) => v.data);
                this.setState({users, loading: false});
            })
            .catch((e) => console.log('promise.all error: ', e));

        })
        .catch((e) => console.log('error: ', e));

        

        
    }
    
    async getData() {
        let results = await makeGetRequest('https://jsonplaceholder.typicode.com/posts')
        console.log('results: ', results.data);
    }

    render() {
        let {users, loading} = this.state;
        return (
            <div>
                {
                    loading ? 
                    <p>Loading...</p> : 
                    <pre>{JSON.stringify(users, null, 2)}</pre>
                }
            </div>
        );
    }
    
}
//https://jsonplaceholder.typicode.com/users
//ajax.lib.js
function makeGetRequest(url) {
    return axios.get(url);
}
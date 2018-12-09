import axios from 'axios';
const URLS = {
    GET_USERS: 'https://jsonplaceholder.typicode.com/users',
    GET_POSTS: 'https://jsonplaceholder.typicode.com/posts',
    GET_TODOS: 'https://jsonplaceholder.typicode.com/todos'
}
export default function getDataFromService(dataType) {

    let url = URLS[dataType];
    console.log(url)
    return function(dispatch) {

        dispatch({type: `${dataType}_REQUEST`});

        axios.get(url)
            .then((r) => {

                dispatch({
                    type: `${dataType}_SUCCESS`,
                    payload: r.data
                });

            })
            .catch((e) => {

                dispatch({
                    type: `${dataType}_ERROR`,
                    payload: e
                });

            });
    }
} 
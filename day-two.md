# Day Two - Asyncronous Code and Introduction to Promises

We started with a class component:
```
class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {users: [], loading: true};
    }
    componentDidMount() {
        const url = 'http://localhost:8888/users';
        makeGetRequest(url) //what to do now?
    }
    ...
}
```
Where `makeGetRequest` is a function that makes a network call to whatever `url` you pass it, something like this:
```
export function makeGetRequest(url) {
    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.onload = function() {
        if (request.status === 200) {
            //success, do something with request.responseText
        } else {
            //failure, handle the fail
        }
    }
    request.send();
}
```
The trouble is `makeGetRequest` doesn't actually return the `users` the `Users` component wants, and it can't because the `request` object is *asynchronous*. How can we expose the data that is only available *after* `request.onload` to other modules like our `Users` component?


**Solution 1: Use a callback**

We could have makeGetRequest return a function of a callback:
```
export function makeGetRequest(url) {
    return function(callback) {
        let request = new XMLHttpRequest();
        request.open('GET', url);
        request.onload = function() {
            if (request.status === 200) {
                //success
                callback({data: JSON.parse(request.responseText)});
            } else {
                //failure, handle the fail
                callback({data: 'Error: Something bad happened'});
            }
        }
        request.send();
    }
}
```
then in `Users`' `componentDidMount` we could pass in a callback like so:
```
...
    componentDidMount() {
        const url = 'http://localhost:8888/users';
        makeGetRequest(url)((response) => this.setState({users: response.data}));
        //now the component has the users in state!
    }
...
```
That works, but there are a number of problems with it. 

On one hand, that one-liner `(response) => this.setState({users: response.data})` won't work well in the real world. The network call could fail, and you'd want to handle that failure appropriately (that one-liner would set the error message 'Error: Something bad happened' as `state.users`, which is probably not appropriate). You could modify `makeGetRequest` so that it returns a function of *two callbacks*, one for success and one for failure:
```
export function makeGetRequest(url) {
    return function(successCallback, failureCallback) { 
    ...etc.
    }
}
```
That's better, but what if that `successCallBack` needs to make more network calls? This is pretty common: you call to get some users, then for each user, you have to get that user's address, ssn info, favorite products, whatever. In complex scenarios, relying on callbacks alone will eventually result in code that looks something like:
```
//callback hell
    makeGetRequest(usersUrl)((users) => {
        users.forEach((user) => {
            //get some info from the user
            makeGetRequest(userSSNUrl)((ssnResp) => {
                //do something with the ssn
                makeGetRequest(isUserATaxCheatUrl)((taxResp) => {
                    makePostRequest(letTheIRSKnowUrl)((irsResp) => {
                        makePostRequest(callPoliceUrl)((policeResp) => ...blah)
                    });
                });
            });
        });
        //now do something like all that mess above with the user's address...
        //TODO: quit writing JavaScript
    });
    ...
```
Now we're building a pyramid of doom that no one wants to reason about. 


**Our Solution: Promises**

A promise is an object that represents the eventual completion of an asyncronous computation or process. A promise can be in 1 of three possible states, `pending`, `fulfilled` or `rejected`, and a promise will go from `pending` to `fulfilled` only once, or from `pending` to `rejected` only once, and it will never do both. This makes a promise *predictable*.  

Any time you have a function that does something asyncronously, like making a network call, it's a good opportunity to use a promise, ex:
```
export function makeGetRequest(url) {
    return new Promise((resolve, reject) => {
    //in that XMLHttpRequest code above, just resolve(value) with the value you want on success
    //and reject(someReason) with some reason on failure
    });
}
```
The Promise constructor takes a function parameter `(resolve, reject) => {...}` called an `executor`, and the `executor` has two built in parameters, conventionally named "resolve" and "reject". `resolve` and `reject` are functions that respectively take the *success value of a fulfilled promise* or a *failure reason* of a rejected promise. When creating your own promises, just remember "resolve on success" and "reject on failure".

Now, with promises we have a pretty nice api for our Users component:
```
...
    componentDidMount() {
        const url = 'http://localhost:8888/users';
        makeGetRequest(url)
            .then((response) => {
                this.setState({users: response.data});
            })
            .catch((e) => {
                this.setState({error: 'Some error message, whatever is appropriate'});
            });
    }
...
```
`makeGetRequest(url)` returns a promise, and is consumable via `.then` and `.catch`. The `then` block above corresponds to the promise resolving (aka "fulfilling") and the `catch` block corresponds to the promise rejecting.

We haven't seen nested network calls yet, but when we do, we will see that things like our pyramid of doom example can often be flattened out rather like so:
```
    p1.then((p1Value) => {
        //do stuff
        return p2; //another promise
    })
    .then((p2Value) => {
        //do stuff
        return p3; //another promise
    })
    ... etc
    .then((p_nValue) => {
        //do stuff
    })
    .catch((e) => {
        //handle errors
    });
```
Promises are not an easy button for all asyncronous scenarios, and depending on what you have to do (the devil is in the "do stuff" lines above), there may be no pretty way to go about it. For the most part however, using promises will make your work easier.

# Axios
The library we use for network requests is called `axios`. To use it:
```
import axios from 'axios';
...
axios.get(someUrl, options) //someUrl: string, options: object (optional)
    .then((response) => {
        //do something with response.data, e.g. set state, save some data...
    })
    .catch((e) => {
        //do something for the error
    });
```
Axios has a lot more features than our `makeGetRequest`, but the basic idea is the same--it's a promise facade around the built-in XMLHttpRequest class. Naturally, axios also has the other http methods:
```
axios.delete(url, options)
axios.post(url, body, options)
axios.put(url, body, options)
```
We'll go over features of the library as we encounter them. For now, this is a great resource: https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index.

**A Note on p.then()**

From the ecmascript language spec (https://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects):
>A promise p is fulfilled if p.then(f, r) will immediately enqueue a Job to call the function f.

>A promise p is rejected if p.then(f, r) will immediately enqueue a Job to call the function r.

This means that the `catch` block in
```
//EX1
        somePromise
            .then((value) => {
                //...
            })
            .catch((e) => {
                //...
            });
```
 is equivalent to the second `then` block in
 ```
 //EX1.1
        somePromise
            .then((value) => {
                //...
            })
            .then(null, (e) => {
                //...
            });
```
That is, `then` can take two parameters, the first for success/resolving, the second for failure/rejecting. This gives rise to another way of consuming promises:
```
//EX2
        somePromise
            .then(
                (value) => {...success},
                (e) => {...do something with e}
            );
```
So **EX2** has 1 `then`, with a success handler and a failure handler passed in. This is certainly legal, but **EX2** will have different behavior from **EX1** and there are many who would urge against it: 
https://github.com/petkaantonov/bluebird/wiki/Promise-Anti-patterns#the-thensuccess-fail-anti-pattern.

Here is one practical difference between **EX1** and **EX2**:
```
        p1.then((value) => {
                //any errors you make here
            })
            .catch((e) => {
                //will be caught here
                //will also catch p1's rejection
            });
        //whereas: 
        p2.then(
                (value) => {
                    //make an error here
                },
                (e) => {
                    //only sees p2's rejection
                    //doesn't see the error in the first handler
                }
            );
```
And the former behavior is usually preferable.
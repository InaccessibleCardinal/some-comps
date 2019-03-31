# Day Three - More on Promises

We explored a couple scenarios that often come up in JavaScript apps, multiple http calls made in parallel and nested http calls. 

**Parallel calls and Promise.all**

Suppose your app needs a member's accounts, that member's address info and that member's social security info. These are 3 independent services and would have to be called separately. Let's suppose the data from these services also will be stored in component state separately:
```
export default class MemberDataComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accounts: [], //TODO: get from accounts api
            address: null, //TODO: get from address api
            ssn: '', //TODO: get from ssn api,
            loading: true //TODO: turn this false when component has all the data
        }
    }
    ...etc
}
```
The natural place to make these calls is in componentDidMount:
```
export default class MemberDataComponent extends React.Component {
    constructor(props) {...as above...}
    componentDidMount() {
        axios.get(accountsUrl)...?
        axios.get(addressUrl)...?
        axios.get(ssnUrl)...?
    }
    ...etc.
}
```
But how do we handle this exactly? Maybe you know that this component will always make exactly 3 api calls, in which case you get the bright idea to implement some sort of counter apparatus, with a counter variable that starts with `let counter = 0`, and then after each axios promise is settled you do something like `counter += 1` and then check to see if `counter === 3`, and if it does you do something like `this.setState({loading: false})`. 

That could work, but 1) it's Mickey Mouse and 2) you don't really know how that component is going to evolve over time. Next week it's going to be 4 api calls, and next year it's going to be 3 again. What we'd like to implement is some logic that says "however many api calls we are making, let the component know when they are all done, then handle things like setting state". This is a good job for `Promise.all`.

`Promise.all` takes an array of promises and consolidates them into a single promise, that you can run `then` and `catch` on in the usual way:
```
...etc.
    componentDidMount() {
        Promise.all([ //yes, 'axios.all' does the same thing
            axios.get(accountsUrl),
            axios.get(addressUrl),
            axios.get(ssnUrl)
        ])
            .then(values => {
                //'values' will be an array of responses from those axios 
                //promises, in the order they are in the array, i.e.:
                //[accountsResponse, addressResponse, ssnResponse]
                //Note: these will be http *responses*, you probably want the 
                //'data' object from them, e.g.: 'accountsResponse.data'
            })
            .catch(e => {
               //e will be the first error encountered if there is one  
            });
    }
...etc.
```
Since the `values` in the `then` block is an array, you can do something slick like this:
```
...etc.
    .then(values => {
        let [accounts, address, ssn] = values.map(response => response.data);
        this.setState({
            accounts,
            address,
            ssn,
            loading: false
        });
    })
    .catch(e => {...});
...etc.

```
Here `values.map(response => response.data)` maps the array of responses to an array of their data, and `let [accounts, address, ssn] =` is how you "destructure" an array. E.g. `let [a,b,c] = myArray`, is the same as saying `let a = myArray[0]; let b = myArray[1]; let c = myArray[2]`. The shorthand for setting state:
```
        this.setState({
            accounts,
            address,
            ssn,
            loading: false
        });
```
Works so long as those variable names match what you called them when you declared the state (actually, it will "work" no matter what; if you didn't name the state fields 'accounts', 'address' and 'ssn', the above `setState` will put those keys on the state with their corresponding values).

**What if `Promise.all` encounters an error?**

That would be below average, but it can happen and the best thing to do about it depends a bit on how everyone wants your app to behave. For example, if its decided that the app should shut down and throw up a trap door message if **any** of these apis fail, then something like this is probably fine:
```
...etc.
.then(values => {
        ...etc.
    })
    .catch(e => {
        this.setState({loading: false, showTrapDoor: true});
        //Subtle point: if Promise.all encounters one rejection, the whole 
        //thing rejects. It's "all or nothing" by default.
    });
...etc.
```
But in some cases this won't do. What if some of the api calls succeeded? Can you somehow get the data from the calls that succeeded? Yes, but this is a good time to be careful, because solutions involve telling `Promise.all` to swallow errors and that can be tricky to handle right. Let's look at some ideas.

You can run the `catch` on each promise in `Promise.all`'s array argument:
```
//EX1
...etc.
        Promise.all([
            axios.get(accountsUrl).catch(e => e.response),
            axios.get(addressUrl).catch(e => e.response),
            axios.get(ssnUrl).catch(e => e.response)
        ])
...etc.
```
You could run both the `then` and the `catch`:
```
//EX2
...etc.
        Promise.all([
            axios.get(accountsUrl).then(resp => resp.data).catch(e => e.response),
            axios.get(addressUrl).then(resp => resp.data).catch(e => e.response),
            axios.get(ssnUrl).then(resp => resp.data).catch(e => e.response)
        ])
        .then(...);
...etc.
```
This comes at a cost: `Promise.all`'s own `catch` won't do anything. Instead *whatever* data you get from these promises, successes or failures, will all show up in `Promise.all`'s `then` block, and you will be on your own when it comes to sorting out the good data from the failures. For example if you try **EX2**, you'll be in a situation like this:
```
...etc.
        Promise.all([
            axios.get(accountsUrl).then(resp => resp.data).catch(e => e.response),
            axios.get(addressUrl).then(resp => resp.data).catch(e => e.response),
            axios.get(ssnUrl).then(resp => resp.data).catch(e => e.response)
        ])
        .then(values => {
            /*the values will look something like this:
            [
                {...some object you expect from one of your apis},
                { //the one/s that failed
                    "data": {},
                    "status": 500,
                    "statusText": "",
                    "headers": {
                     ...some stuff
                    },
                    "config": {
                      ...more stuff
                    }
                },
                {...some other object you expect from one of your apis},
                ...etc.
            ]
            */
            //You'll need to implement some custom logic to sort through these values now 
        });
...etc.
```
That sounds terrible, but you know 1) what order the data are coming back, 2) what their successes and failures should look like, and 3) you probably already have logic to handle both successes and failures. So, chin up, it's an opportunity to practice some creative refactoring. 
***
**You May Not Ever Need To Do The Following, But You Can.**

**`Promise.resolve`(x) and `Promise.reject`(x)**
These methods treat *any* values as if they were resolved or rejected promises. E.g.:
```
let myResolved = Promise.resolve(42);
let myRejected = Promise.reject('oops');

myResolved.then(value => console.log(value)); //prints 42
myRejected.then(null, e => console.log(e)); //prints 'oops'
//or equivalently
myRejected.catch(e => console.log(e)); //prints 'oops'
```

**`Promise.all` and Mixed Sync/Async Data**

`Promise.all` "promisifies" any values you put in its arguments array. This means that you can mix synchronous data with your asynchronous data and treat them uniformly:
```
    const mySynchronousData = {data: {...}};
    Promise.all([
            axios.get(accountsUrl),
            axios.get(addressUrl),
            axios.get(ssnUrl),
            mySynchronousData  
            //this last value is treated as if it were 'Promise.resolve(mySynchronousData)''
        ])
        .then(values => {
            //you could grab mySynchronousData.data
            //the same way you do for the other values
        })
```
**`Promise.race`([p1, p2, ...])**

`Promise.race`(promiseArray) will settle with the value of the first promise that settles. You could use it for a timeout, for example: 
```
let p1 = axios.get(mySlowApiUrl);
let p2 = new Promise((resolve, reject) => {
    setTimeout(
        () => reject({error: 'This api is too slow.'}),
        3000
    );
});
Promise.race([p1, p2])
    .then(v => { 
        doSomethingUseful(v);
    })
    .catch(e => {
        apologizeToUser(e);
    });
```
Moving on.

**Nested Promises**

What about api calls that cannot be made until we get data from a previous call? Lets say we want to get some user data, and then we need to use some piece of that user's data, call it an 'id', to construct the url for an api that returns that user's ssn. We are in a situation like this:
```
...etc.
    componentDidMount() {
        axios.get(userUrl)
        .then(userResponse => {
            let user = userResponse.data;
            ...do something with user perhaps...
            let ssnUrl = `https://api.com/myssnapi/${user.id}`;
            //EX3 what to now that we have the ssnUrl?
        })
        ...
    }
...etc.
```
The question posed in **EX3** has two answers, and one is better than the other. 
The first answer would be to simply run another axios promise block inside that first `then` block, i.e.:
```
//Answer 1
...etc.
    componentDidMount() {
        axios.get(userUrl)
        .then(userResponse => {
            let user = userResponse.data;
            
            let ssnUrl = `https://api.com/myssnapi/${user.id}`;
            axios.get(ssnUrl)
                .then(ssnResponse => {
                    //do something with the ssnResponse
                })
                .catch(e => {
                    //handle ssn execption
                })
        })
        .catch(e => {
            //handle e
        })
        ...
    }
...etc.
```
**Answer 1** will work, but it kinda misses the point of promises. We are trading "callback hell" for a promise-based version of it. A better approach would be this.
```
//Answer 2
...etc.
    componentDidMount() {
        axios.get(userUrl)
        .then(userResponse => {
            let user = userResponse.data;
            ...
            let ssnUrl = `https://api.com/myssnapi/${user.id}`;
            return axios.get(ssnUrl); //return a promise
        })
        .then(ssnResponse => {
            //do whatever you have to do with the ssnResponse.data
        })
        .catch(e => {
            //handle e
        });
        ...
    }
...etc.
```
That is, **Answer 2** *returns a promise*, so that you can address the ssnResponse in a subsequent `then` block. You can imagine perhaps another api call might have to be made based on data from the `ssnResponse.data`, if so, you can have the ssnResponse block return another promise and add another `then` to the promise chain, so-on and so-forth. The `catch` at the end will still catch any exception that happens in the `then` blocks above it in the chain. This is what we were referring to when we said that promises can "flatten out" nested callbacks. 

**How to Handle Setting State**

This is a good question, and the answer probably depends on what your app needs to do. It's worth thinking about because `setState` triggers re-rendering, which isn't cheap. Let's say your component cannot function without each piece of data from your promise chain. Then you might want to postpone setting state until the last piece of data arrives, e.g.:
```
...etc.
    componentDidMount() {
        let updates = {}; //put response date in this object
        axios.get(userUrl)
        .then(userResponse => {
            let user = userResponse.data;
            updates.user = user; //won't trigger a re-render
            let ssnUrl = `https://api.com/myssnapi/${user.id}`;
            return axios.get(ssnUrl); //return a promise
        })
        .then(ssnResponse => {
            updates.ssn = ssnResponse.data; //still won't trigger a re-render
            return someOtherPromise;
        })
        .then(other => {
            updates.otherData = other.data;
            this.setState({...updates}); //batching the updates so state is only set once
        })
        .catch(e => {
            //handle e
        });
        ...
    }
...etc.
```
What if your component can live without some of the data? You still *probably don't want to do something like this*:
```
componentDidMount() {
    promise1.then(r1 => {
        this.setState({key1: r1.data}); //300ms later
        return promise2;
    })
    .then(r2 => {
        this.setState({key2: r2.data}); //375ms later
        return promise3;
    })
    ...
    .then(r_n => {
        this.setState({key_n: r_n.data}); //700ms later
    })
    .catch(...);
    
}
```
**.finally**

The following might be useful as an alternative:
```
componentDidMount() {
    let updates = {};
    promise1.then(r1 => {
        updates.key1 = r1.data;
        return promise2;
    })
    .then(r2 => {
        updates.key2 = r2.data;
        return promise3;
    })
    ...
    .then(r_n => {
        updates.key_n = r_n.data;
    })
    .catch(...)
    .finally(() => {
        this.setState({...updates});
    });
}
```
Yes, there is a `.finally` method that will run after all the promises in your chain have settled. You'll at least get data from promises in the chain *up until the one that rejected*, which might be better than nothing. `finally` could also be used in conjunction with the `Promise.all` examples above...whether it'll be useful depends on what you need to do.
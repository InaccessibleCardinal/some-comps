# Day One
Many JavaScript frameworks use some form of html templating in tandem with JavaScript to create dynamic apps. React doesn't do this. With React you will be programmatically building html DOM with JavaScript. In class we looked at a baby version of this. 
# Building some DOM
We had a `render` function that put elements in the DOM and we had a `createElement` function that made DOM elements. We were then able to use them like this:
```
render(
    createElement('h1', {class: 'headline'}, 'My Headline')
);
```
This put `<h1 class="headline">My Headline</h1>` in our DOM. Very exciting. 

We wanted our DOM elements to be more interesting, so we made a `withEvents` function:
```
function withEvents(eventName, eventHandler) {
    return function(element) {
        element.addEventListener(eventName, eventHandler);
        return element;
    };
}
```
That is, `withEvent` is a `function that returns a function` of an element, which in turn puts an event listener on that element and returns the element. We used it like this:
```
let myElementWithClicks = withEvents('click', handler)(myElement);
```
The point is only to get used to this pattern. We take something plain, like an element, and endow it with some new behavior by composing it with a function. In fact, the following also makes sense:
```
withEvents('mouseover', otherHandler)(withEvents('click', handler)(myElement))
```
We can take a plain thing, decorate it with `withEvents`, and then do it again...however many times we want to. Rather than subclassing some class, MyClass, to get a "special version" of MyClass, in javascript, you can often compose functions to the same effect. Many of the "higher-order components" we use in React exhibit this pattern. This technique is called "currying", after Haskell Curry https://en.wikipedia.org/wiki/Haskell_Curry.

# What's 'this'
Here's a class in JavaScript:
```
class Button {
    constructor(text, name) {
        this.name = name;
        this.element = create('button', null, text)
        this.init();
    }
    init() {
        render(
            withEvents('click', this.listener)(this.element)
        );
    }
    listener() {
        console.log(`This listener was invoked by ${this.name}`);
    }
}
//new it up:
let b = new Button('Some Button Text', 'buttonName');
```
Doing this, we get a `<button>Some Button Text</button>` in the DOM. Our button does indeed respond to clicks but something is wrong. When you click on it, the console only shows "This listener was invoked by". What happened to `${this.name}`? Our trouble is that `this.listener` is being invoked *in the context of another object*, namely the button element itself, not the class instance. The moral:
>The `this` keyword is ambiguous in JavaScript. It depends on the context in which a function is called.

There are a number of fixes, some better than others. 

**The standard fix:**
```
class Button {
    constructor(text, name) {
        this.name = name;
        this.element = create('button', null, text)
        this.listener = this.listener.bind(this); //bind the method to the instance
        this.init();
    }
    //...etc
```
Details on Function.prototype.bind can be found here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind or here for deep thinkers https://www.ecma-international.org/ecma-262/5.1/. 

Long story short, when you do `f.bind(obj)` to a function `f`, you create a copy of `f` and fix the `this` value to `obj`. For our `Button` class, we have to bind the `listener` method to `this` in the constructor if we want it to have the instance `b`'s `this` value. 

After binding `this`, if you inspect the `Button` instance `b` in the console you'll see something like:
```
b;
{listener:f, name: buttonName, element: button}
```
So `b` *has his own copy of the listener method*, which is the point and why it works. 

**Another fix:**
```
class Button {
    //...
    listener = () => { // i.e. define the method as an "arrow function"
        console.log(`This listener was invoked by ${this.name}`);
    }
}
```
If your Babel settings are newish, this will work too, and it amounts to the same thing: the `Button` instance will get his own copy of the listener method. If your Babel is older, you'll probably get a "bad method definition" error depending on the JavaScript engine (Chrome appears to understand it natively nowadays). The mozilla people will shake their heads (link below), but if you really like arrow functions and your toolchain allows it, you can define your methods this way.

>Caveat: **binding in the constructor** or **arrow function method definitons** are expressly for methods that will be invoked in **contexts other than an instance of the class**, like event listeners.

>Remember, you are creating a **new copy** of the method so that it can still use the `this` you want it to. If a method will never be called in the context of another object, there's no need to `this`-bind it and you can forgo creating any copies of that method.

# Arrow functions
Details are here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions. Upshot: arrow functions ignore the `this` context of where they are invoked, instead they will have the `this` context from where they are defined. 

In a class, this is what's happening (or what's happening is logically equivalent to this):
```
//example A:
let _this = this;
this.listener = function () {
    console.log("This listener was invoked by " + _this.name));
});
```
Much of the time:
```
const myF = () => {
    doSomething();
};
```
just becomes:
```
//example B:
var myF = function(){
    doSomething();
};
```
However, because of what happens in "example A" above, if you try to use it to define a constructor:
```
const MyClass = (name) => {
    this.name = name;
};
```
You'll get an error because what's happening is something like this (or, the engine will try to do something logically equiavlent to this):
```
//example C:
var _this = void 0; //or undefined perhaps
var MyClass = function MyClass(name) {
  _this.name = name; //lol wut?
};
```
Which is nonsense of course. 

For normal functions, the following "old school technique" makes sense:
```
function argumentInspector() {
    let l = arguments.length;
    for (let i = 0; i < l; ++i) {
        console.log('arg ' + i + ' is: ' + arguments[i]); //will log each argument
    }
}
```
And that's because normal functions have an `arguments` iterable built-in. But, like we saw in examples A and C, if you try to define `argumentInspector` with an arrow:
```
const argumentInspector = () => {
    let l = arguments.length;
    for (let i = 0; i < l; ++i) {
        console.log('arg ' + i + ' is: ' + arguments[i]);
    }
}
```
the engine is going to try to do something like this:
```
var _arguments = arguments; // Um, nope.  
var argumentInspector = function() {
    let l = _arguments.length;
    for (let i = 0; i < l; ++i) {
        console.log('arg ' + i + ' is: ' + _arguments[i]); //"Reference Error", since arguments is undefined in the first place
    }
}
```
So when to use arrows? When you want to be concise and want to ignore the normal behavior `this` has in functions/methods and you don't need the `arguments` object. 

**Implicit "return"**

Arrow functions can be used in both of the following ways. You can kick down the code 1 line and explicitly return:
```
//example D:
let names = myArray.map((item) => {
   return item.name;
});
```
or you can "implicitly return":
```
//example E:
let names = myArray.map((item) => item.name);
```
If you kick the code down like example D, you have to explicitly return the value. If you do it in one line, you don't write 'return'. This horse is long dead. Moving on.

# React
Finally some React. The first React component we saw looked something like this:
```
import React from 'react';
export default function App(props) {
    return ( 
        React.createElement('div', {className: 'my-p-class'}, 'Hello!')
    );
}
//'class' is a reserved word in JavaScript, so in React one uses "className"
//to refer to the DOM attribute of a css class    
```
It's just a function that returns whatever `React.createElement('div', {className: 'my-p-class'}, 'Hello!')` does. `React.createElement` isn't syntactically dissimilar to our baby 'createElement' function, but what it does is quite different. Our createElement made actual DOM elements, whereas `React.createElement` creates a JavaScript object that looks something like:
```
{
    type: 'div',
    props: {
        className: 'my-p-class',
        children 'Hello!'
    },
    //some other stuff
}
```
This is React's internal representation of a div that looks like `<div class="my-p-class">Hello</div>`. React builds the entire DOM tree as a tree of these objects, and as these objects change, React will make corresponding changes to the actual DOM. Obviously writing a tree of nested function calls for everything we want in our DOM would be awful, so instead we write something like:  
```
export default function App(props) {
    return (
        <div className="my-p-class"> //React.createElement makes a "virtual" div
            <p>Hello!</p> //React.createElement makes a "virtual" paragraph...
        </div>
    );
}
```
That syntax is called JSX. You have to be in the scope of React to use JSX, and when you do use it, Babel transpiles it into `React.createElement` function calls. 

So far, `App` just spits out some virtual DOM; it doesn't "do" anything. To make `App` do something, we'll need to leverage either `state` or `props`. We'll look at `state` first.

**Make App a Class**

Each React class must implement at least one method, `render`. The render method will basically be the body of the App function above:
```
export default class App extends React.Component {
    render() {
        return (
            <div className="my-p-class">
                <p>Hello!</p>
            </div>
        );
    }
}
```
Now `App` needs some `state`. Let's try to make App increment a counter when we click on a button. First, `state` is defined in `App`'s constructor, we'll also add an `increment` class method and bind it: 
```
export default class App extends React.Component {
    constructor(props) {
        super(props); //must do this before anything else!
        this.state = {counter: 0};
        this.increment = this.increment.bind(this); 
    }
    increment() {
        //TODO
    }
    render() {
        return (
            <div className="my-p-class">
                <button>Increment!</button>
            </div>
        );
    }
}
```
In order to extend `React.Component` (or to extend any class in JavaScript) you have to call `super` (here, `Component`) in the constructor. Then we define `state.counter`, and we `this`-bind our `increment` method because that method will need to access `this.state`. Our `increment` method will update the counter. This kind of thing won't work however:
```
...
increment() {this.state.counter++}
...
```
React components have an api for setting state, namely `setState`:
```
...
increment() {
    this.setState({counter: this.state.counter + 1});
}
...
```
Now we'd like our button to use that increment method, and let's show our counter value in the DOM as well. This works:
```
...
render() {
        return (
            <div className="my-p-class">
                <button onClick={this.increment}>Increment!</button>
                <p>Count: {this.state.counter}</p>
            </div>
        );
    }
```
Inside JSX, any valid JavaScript expression will be evaluated inside curly braces { }. So `<p>Count: {this.state.counter}</p>` will end up being `<p>Count: 0</p>`, `<p>Count: 1</p>` etc. depending on the counter value. 

Putting it all together, our App now looks like:
```
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {counter: 0};
        this.increment = this.increment.bind(this); 
    }
    increment() {
        this.setState({counter: this.state.counter + 1});
    }
    render() {
        return (
            <div className="my-p-class">
                <button onClick={this.increment}>Increment!</button>
                <p>Count: {this.state.counter}</p>
            </div>
        );
    }
}
```
Piece of cake.

**A Caveat About Binding**

Sometimes you'll see code like this:
```
...
render() {
    return (
        <button onClick={this.clickHandler.bind(this)}>Click Me</button>
    );
}
```
That is, `this.clickHandler.bind(this)` is happening in the render method (instead of the constructor). Some truths about this practice:
- It does work
- It's usually a bad idea
- One should try to avoid it

Remember, `bind` creates a new function. If you `bind` in render, then every time the render method is called you're creating a new function, and you probably don't want to do that. The same can be said for this:
```
...
render() {
    return (
        <button onClick={function() {
            someFunc();
        }}>Click Me</button>
    );
}
```
and this:
```
...
render() {
    return (
        <button onClick={() => someFunc()}>Click Me</button>
    );
}
```
They all amount to the same thing: a new function will be created on each render. So, binding in the constructor, or arrow function method definitions (if that's your thing) are the better ways to go.
# Babel and Webpack
Our React applications rely on Babel and Webpack. For our apps, the two libraires work hand-in-hand. The following is a very high level explanation of what they do. Babel is a transpiler, which means it takes fancy JavaScript like   
```sh
const myP = <p className={'my-p'}>Stuff</p>
```
And turns it into something that the target environment can understand like
```
var myP = React.createElement(
    'p',
    {className: 'my-p'},
    'Stuff'
);
```
Webpack is a module bundler, it builds the bundled JavaScript that actually runs in the browser. There are two senses of the term "module" here. 

Back when JavaScript developers had to walk to and from school uphill in the snow, they would manually put script tags in an html document:
```
<script type="text/javascript" src="my-script.js"></script>
<script type="text/javascript" src="some-other-script.js"></script>
```
In my-script.js there might be variables that, if you weren't carefull, could clash with variables referenced in some-other-script.js. So a design pattern emerged that could protect your variables. 
```
//my-script.js
var myThing = (function(someInject) {
    var value = 42, myBool = someInject.bool; //all private
    //...more private stuff
    return {
        getPublicMethod1: someFunctionDefinedInHere,
        getPublicValue1: someThingDefinedInHere,
        //...etc...these are all "public"
    };
})(someInject);
```
Because the variables `value` and `myBool` are wrapped in a function, they are private and can't clash with those referenced in other scripts. The return value of `myThing` would usually be some public api that other scripts could access and use it like:
```
var x = myThing.getPublicMethod1();
doSomething(x);
```
That immediately invoked function in my-script.js, `(function(){ var value = ...})()`, is a module. Webpack turns your code into a bunch of those. Open up your browser console and try to reference some variables you have defined in your React code, e.g. you probably have a variable called 'App'. You'll see these variable are `undefined`, and that's because Webpack wrapped them in functions. 

But from the nodejs perspective, each of your files is also a module. Each file/module has reference to an `exports` object which is used to facilitate communication between files. For example, you might have something like this in one of your files:
```
//MyClass.js
export someValue; //a "named" export
export default MyClass; //the "default" export
```
and then elsewhere:
```
//elsewhere.js
import MyClass, {someValue} from './MyClass';
```
First, Babel is going to turn MyClass.js into something that says "put `someValue` on the `exports` object, and put `MyClass` on `exports.default`".  Then in elsewhere.js, Babel will convert the code into something that says "require `MyClass` from the `exports.default` that belongs to ./MyClass.js, and pull `someValue` off `exports.someValue`". 

Finally, Webpack will recursively inspect all the "requires" defined in your code and make them browser-ready by turning them into the appropriate `(function(somethingRequired){...})(somethingRequired)` type expressions. 

These are good resources if you want to go deeper: 
- https://babeljs.io/repl 
- https://webpack.js.org/

import React from 'react';


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: 0,
            show: false, 
            loading: true
        };
        this.addToCounter = this.addToCounter.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({loading: false})
        }, 3000);
    }

    addToCounter() {
        let {counter, show} = this.state;
        counter += 1;
        show = (counter % 2 === 1) ? true : false;
        this.setState({counter, show});
    }

    makeStuff() {
        return (
            <p>More stuff</p>
        );
    }

    render() {    
        let {counter, show, loading} = this.state;
        let text = 'Add to Counter';
        let h = this.addToCounter;

        return (
            <div>
                <button onClick={h}>{text}</button>
                <p>{counter}</p>
                {show && this.makeStuff()}
                {loading && <Loader />}
            </div>
        );
    }
}

const loaderStyle = {
    backgroundColor: 'grey',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 2,
    height: '100%',
    width: '100%' 
}

function Loader(props) {

    return (
        <div style={loaderStyle}>
            <h1>LOADING...</h1>
        </div>
    );
}

let x = [1,2,3,4].map((number, index, arr) => {
    console.log('arr: ', arr)
    console.log('index: ', index)
    return {
        id: Math.random(),
        name: number
    };
})
.filter((wackyObject) => wackyObject.name % 2 === 0)
.reduce((prev, curr) => prev.name + curr.name);

console.log('X! ', x)
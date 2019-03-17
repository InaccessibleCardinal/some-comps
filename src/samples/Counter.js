import React, {Component} from 'react';

let funcs = [];
function compareFuncs(f) {
    funcs.push(f);
    console.log('are they the same? ', f === funcs[funcs.length - 2]);
    console.log('funcs: ', funcs);
}


export default class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: 0,
            list: []
        };
        this.addToCounter = this.addToCounter.bind(this);
        this.removeFromList = this.removeFromList.bind(this);
    }
    
    internalMethod(str) {
        console.log(`${JSON.stringify(this.state)} has a ${str}`);
    }

    addToCounter() { 
        let {counter, list} = this.state;
        this.internalMethod(`state_count_${counter}`);
        this.setState({
            counter: counter + 1,
            list: list.concat([{id: `state_count_${counter}`, value: `Counter: ${counter}`}])
        });
    }

    removeFromList(event) {
        let {id} = event.target;
        let {list} = this.state;
        let itemToRemove = list.find((item) => item.id === id);
        let index = list.indexOf(itemToRemove);
        let len = list.length;
        this.setState({
            list: list.slice(0, index).concat(list.slice(index + 1, len))
        });
    }

    render() {
        
        let {counter, list} = this.state;
        let listMarkup = list.map((item) => {
            let {id, value} = item;
            return (
                <li 
                    key={id} 
                    id={id}
                    onClick={this.removeFromList}
                >
                    {value}
                </li>    
            );
        });
        
        return (
            <div>
                <button onClick={this.addToCounter}>
                    Add!
                </button>
                <h2>
                    {counter}
                </h2>
                <ul>
                    {listMarkup}
                </ul>
            </div>
        );
    }

}

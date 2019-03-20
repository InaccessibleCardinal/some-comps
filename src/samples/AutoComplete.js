import React from 'react';
import {words} from './words';
import { timingSafeEqual } from 'crypto';

export default class AutoComplete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: '', showSuggestions: false};
        this.changeHandler = this.changeHandler.bind(this);
        this.selectFromList = this.selectFromList.bind(this);
        this.clear = this.clear.bind(this);
        this.ref = React.createRef(); 
    }

    changeHandler() {
        this.setState({value: this.ref.current.value, showSuggestions: true });
    }

    selectFromList(e) {
        let selectedValue =  e.target.id;
        this.setState({value: e.target.id, showSuggestions: false});
    }

    clear() {
        this.setState({value: '', showSuggestions: false});
    }

    render() {
        let {showSuggestions, value} = this.state;

        return (
            <div>
                <input value={value} ref={this.ref} onChange={this.changeHandler} />
                <button onClick={this.clear}>X</button>
                {
                    showSuggestions && 
                    <Suggestions 
                        value={value} 
                        selectFromList={this.selectFromList} 
                    />
                }        
            </div>
        );
    }
}


function Suggestions({value, selectFromList}) {

    let possibleMatches = words.reduce((acc, curr) => {
        if (beginsWith(curr, value)) {
            let currMarkup = <p onClick={selectFromList} id={curr} key={curr}>{curr}</p>
            return acc.concat([currMarkup]);
        }
        return acc;
    }, []);

    return (
        <div>
            {possibleMatches}
        </div>
    );

}

function beginsWith(str, subStr) {
    let isBeginning = true;
    let len = subStr.length;
    
    if (len === 0) {
        return false;
    }
    for (let i = 0; i < len; ++i) {
        if (subStr[i] !== str[i]) {
            isBeginning = false;
        }
    }
    
    return isBeginning;
}
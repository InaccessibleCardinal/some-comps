import React from 'react';

export default class StyleEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            childStyles: {},
            currentKey: '',
            currentValue: ''
        };
        this.setChildStyles = this.setChildStyles.bind(this);
        this.revertChildStyles = this.revertChildStyles.bind(this);
        this.updateKey = this.updateKey.bind(this);
        this.updateValue = this.updateValue.bind(this);
    }
    setChildStyles() {
        let {childStyles, currentKey, currentValue} = {...this.state};
        let newStyles = {...childStyles};
        newStyles[currentKey] = currentValue;
        // console.log('newStyles: ', newStyles)
        this.setState({childStyles: newStyles, currentKey: '', currentValue: ''});
    }
    revertChildStyles() {
        this.setState({childStyles: {}, currentKey: '', currentValue: ''});
    }
    updateKey(e) {
        let v = e.target.value;
        this.setState({currentKey: v});
    }
    updateValue(e) {
        let v = e.target.value;
        this.setState({currentValue: v});
    }
    render() {
        let childStyles = this.state.childStyles;
        return (
            <div>
                <input value={this.state.currentKey} onChange={this.updateKey} />
                <input value={this.state.currentValue} onChange={this.updateValue}/>
                <button onClick={this.setChildStyles}>Update</button>
                <button onClick={this.revertChildStyles}>Revert</button>
                <Preview styles={childStyles}/>
            </div>
        );
    }
}

function Preview({styles}) {
    const previewWrapperStyle = {
        width: '90%',
        margin: '10px auto',
        border: '1px solid',
        minHeight: '500px'
    };
    return (
        <div style={previewWrapperStyle}>
            <div style={styles}>Some stuff in the div</div>
        </div>
    ); 
}

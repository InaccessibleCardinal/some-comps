import React from 'react';

export class A extends React.Component {
    constructor() {
        super();
        this.state = {btnText: 'My Button'}
    }
    render() {
        return (
            <button>{this.state.btnText}</button>
        );
    }
}

export class B extends A {
    constructor() {
        super();
        this.state = {
            btnText: super().state.btnText,
            hovering: false
        };
    }
        
    handleMouseOver = () => {
        this.setState({hovering: true});
    }
    handleMouseOut = () => {
        this.setState({hovering: false});
    }
    render() {
        let superRender = super.render();
        let {hovering} = this.state;
        return (
            <div 
                onMouseOver={this.handleMouseOver}
                onMouseOut={this.handleMouseOut}
            >
                <span className={hovering ? 'visible' : 'invisible'}>my special tooltip</span>
                {superRender}
            </div>
        );
    }
}

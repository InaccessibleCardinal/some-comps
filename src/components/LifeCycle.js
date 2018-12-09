import React from 'react';
//docs: https://reactjs.org/docs/react-component.html

export class Life1 extends React.Component { //wrp, DidMount & WillUnmount
    constructor() {
        super();
        this.state = {number: 1, counter: 0};
        this.increase = this.increase.bind(this);
        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        this.counterFn = setInterval(this.tick, 1000);
    }

    tick() {
        this.setState({counter: this.state.counter + 1});
    }

    increase() {
        this.setState({number: this.state.number * 2});
    }

    componentWillUnmount() { //to prevent setting state on unmounted component
        clearInterval(this.counterFn);
    }

    render() {
        let {number, counter} = this.state;
        return (
            <LifeWRP 
                numberProp={number} 
                counter={counter} 
                increase={this.increase} 
            />
        );
    }
}

class LifeWRP extends React.Component { //wrp example to show dangers & how to avoid
    
    componentWillReceiveProps(nextProps) { //to check if props have changed
        console.log('nextProps: ', nextProps)
        if (nextProps.counter !== this.props.counter) { //carefull how you do this
            this.props.increase();
        }
    }
    
    render() {
        console.log('rendering...')
        
        let {numberProp, counter} = this.props;
        return (
            <div>
                <p>Counter: {counter}</p>
                <p>Doubler: {numberProp}</p>
            </div>
        );
    }
}

export class Life2 extends React.Component { //more realistic example with a network call
    constructor(props) {
        super(props);
        this.state = {user: null};
    }

    componentDidMount() {
        let x = new XMLHttpRequest();
        x.open('GET', 'https://jsonplaceholder.typicode.com/users/1');
        x.onreadystatechange = () => {
            if (x.readyState === 4 && x.status === 200) {
                this.setState({user: JSON.parse(x.responseText)});
            }
        }
        x.send();
    }
    render() {
        let {user} = this.state;
        return (
            <RealWRP user={user} />
        );
    }
}

class RealWRP extends React.Component {
    state = {userLoading: true};
    componentWillReceiveProps(nextProps) {
        if (nextProps.user !== this.props.user) {
            this.setState({userLoading: false});
        }
    }
    render() {
        let {userLoading} = this.state;
        let {user} = this.props;
        if (userLoading) {

            return (<p>Loading...</p>);

        } else {
            return (
                <div>
                    <User user={user} />
                </div>
            );
        }
        
    }
}

function User({user}) {
    return (
        <div>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
        </div>
    );
}
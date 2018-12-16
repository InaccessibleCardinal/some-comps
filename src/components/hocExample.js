import React from 'react';
import haxios from '../haxios';

export function withService(WrappedComponent, config, url) {
    
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {loading: true, data: null};
        }
        componentDidMount() {
            haxios.get(url)
            .then((r) => this.setState({loading: false, data: r.data}))
            .catch((e) => console.log(e));
        }
        render() {
            let {loading, data} = this.state;
            if (loading) {
                return (
                    <div><p>Loading...</p></div>
                );
            }else {
                let dynamicProps = {};
                dynamicProps[config.dataName] = data;
                let otherProps = {a: 42};
                return (
                    <WrappedComponent {...dynamicProps} {...otherProps} />
                );
            }
            
        }
    }
}


export function ShowUsers({users}) {
    
    let usersMarkup = users.map((u) => {
        return (
            <div key={u.id}>
                <p>{u.name}</p>
                <p>{u.email}</p>
            </div>
        );
    });
    return (
        <div>
            <h1>Users:</h1>
            {usersMarkup}
        </div>
    );
}

export function ShowPosts({posts}) {
    let postsMarkup = posts.map((p) => {
        return (
            <div key={p.id}>
                <p>{p.title}</p>
            </div>
        );
    });
    return (
        <div>
            <h1>Posts:</h1>
            {postsMarkup}
        </div>
    );
}


function Sample(props) {
    let propsTable = Object.keys(props).map((key, i) => {
        return (
            <p key={i}>{key + ': ' + props[key]}</p>
        );
    });
    return (
        <div>
            {propsTable}
        </div>
    );
}


//connect(fn)(Component) example
function connect(state, mapper) {
    return function(Comp) {
        return function() {
            return <Comp {...mapper(state)} />;
        }
    }
}


let state = {a: 42, b: 'some text', c: 'more', d: '99 problems'};
function mapState(state) {
    return {
        a: state.a,
        b: state.b,
        c: state.c
    }
}
export const WrappedSample = connect(state, mapState)(Sample);


export function Menu({items}) {
    let menuItems = items.map((item) => {
        return (
            <li key={item.id}>
                <a href={item.href}>{item.value}</a>
            </li>
        );
    });
    return (
        <ul>
            {menuItems}
        </ul>
    );
}

let myItems = [
    {id: 1, href: '#one', value: 'Value one'},
    {id: 2, href: '#too', value: 'Value two'},
    {id: 3, href: '#tree', value: 'Value 3'}
]

export function withShowHide(Comp) {
    return class extends React.Component {
        state = {showing: false, items: myItems};
        toggleShowing = () => { 
            this.setState((previousState) => {
                return {showing: !previousState.showing};
            });
        }
        render() {
            let {showing} = this.state;
            
            return (showing) ? 
                <div>
                    <button onClick={this.toggleShowing}>
                        Hide
                    </button>
                    <Comp items={this.state.items} />
                </div> :
                <div>
                    <button onClick={this.toggleShowing}>
                        Show
                    </button>
                </div>;
        }
    }
}
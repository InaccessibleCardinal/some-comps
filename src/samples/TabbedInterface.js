import React from 'react';

const flexStyle = {display: 'flex'};
const tabButtonStyle = {
    width: '100%', 
    height: '100%', 
    cursor: 'pointer',
    background: '#efefef',
    border: 'none',
    borderBottom: '1px solid',
    padding: '10px'
}

export default class TabbedInterface extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accounts: [
                {id: 'acc1', name: 'Item 1', data: 42},
                {id: 'acc2', name: 'Item 2', data: 100},
                {id: 'acc3', name: 'Item 3', data: 10},
                {id: 'acc4', name: 'Item 4', data: 11}
            ],
            selectedAccount: null
        };
        this.selectAccount = this.selectAccount.bind(this);
    }

    selectAccount(e) {
        let nextSelectedAccount = this.state.accounts.find((a) => a.id === e.target.id);
        this.setState((prevState) => prevState.selectedAccount = nextSelectedAccount);
    }

    render() {
        let {accounts, selectedAccount} = this.state;
        let tabs = accounts.map((a) => {
            let {id} = a;
            return (
                <Tab 
                    key={id} 
                    select={this.selectAccount}
                    item={a}
                />
            );
        });
        return (
            <div style={flexStyle}>
                <div style={{flex: 1}}>
                    {tabs}
                </div>
                <div style={{flex: 4}}>
                    {
                        selectedAccount ? 
                        <Details item={selectedAccount} /> :
                        <p>None selected yet</p> 
                    }
                </div>
            </div>
        );
    }
    
}

function Tab({select, item}) {
    let {id, name} = item;
    return (
        <div>
            <button 
                id={id} 
                onClick={select}
                style={tabButtonStyle}
            >
                {name}
            </button>
        </div>
    );
}

function Details({item}) {
    return (
        <div>
            <p>{item.data}</p>
        </div>
    );
}
import React from 'react';

class Favs extends React.Component {
    handler = (e) => {
        console.log(e)
    }
    render() {
        let {data} = this.props;
        let dataMarkup = data.map((d) => {
            return (<p onClick={this.handler} key={Math.random()}>{d}</p>)
        });
        return (
            <div>
                {dataMarkup}
            </div>
        );
    }
}
let TabbedInterface = makeTabbedInterface(
    [
        {tabName: 'Products', component: Products, data: ['p1', 'p2', 'p3']},
        {tabName: 'Caps', component: Caps, data: ['cap1', 'cap2', 'cap3']},
        {tabName: 'Orgs', component: Orgs, data: ['o1', 'o2']},
        {tabName: 'Favs', component: Favs, data: ['fav 1', 'fav 2', 'fav 3']}
    ]
)


function makeTabbedInterface(configArray) {

    return class extends React.Component {
        constructor(props) {
            super(props);
            console.log('Comp: ',configArray[0].component.displayName)
            this.state = {
                tabs: configArray,
                selectedTab: configArray[0].tabName 
            };
            this.selectTab = this.selectTab.bind(this);
        }
        selectTab(e) {
            this.setState({selectedTab: e.target.id}, () => console.log(this.state));
        }
        renderTabContent(name) {
            
            let tabToRender = this.state.tabs.find((t) => {
                return t.component.name === name;
            });
            let C = tabToRender.component;
            let dataProps = {data: tabToRender.data};
            return <C {...dataProps} />;
            
        }
        render() {
            let ulStyle = {listStyleType: 'none'};
            let selectedStyle = {
                color: '#000',
                backgroundColor: '#fff', 
                cursor: 'pointer', 
                display: 'inline', 
                padding: '10px',
                border: '1px solid'
            };
            let normalStyle = {
                color: '#fff',
                backgroundColor: 'navy', 
                cursor: 'pointer', 
                display: 'inline',
                padding: '10px',
                border: '1px solid'
            };
            let {tabs, selectedTab} = this.state;
            let $tabs = tabs.map((t) => {
                return (
                    <li 
                        style={t.tabName === selectedTab ? selectedStyle : normalStyle}
                        key={t.tabName} 
                        id={t.tabName} 
                        onClick={this.selectTab}
                    >
                    {t.tabName}
                    </li>
                );
            });
            
            return (
                <div>
                    <ul style={ulStyle}>{$tabs}</ul>
                    <div style={{border: '1px solid'}}>
                    {this.renderTabContent(selectedTab)}
                    </div>
                </div>
            );
        }
    }
}

function Products({data}) {

    let dataMarkup = data.map((d) => {
        return (<p key={Math.random()}>{d}</p>)
    });
    return (
        <div>
            {dataMarkup}
        </div>
    );
    
}
Products.displayName = 'XYZ';

function Caps({data}) {
    
    let dataMarkup = data.map((d) => {
        return (<p key={Math.random()}>{d}</p>)
    });
    return (
        <div>
            {dataMarkup}
        </div>
    );

}

function Orgs({data}) {

    let dataMarkup = data.map((d) => {
        return (<p key={Math.random()}>{d}</p>)
    });
    return (
        <div>
            {dataMarkup}
        </div>
    );

}
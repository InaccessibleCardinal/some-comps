import React from 'react';
import haxios from '../haxios';

export function listWithDataService(Comp, serviceConfig) {
    let {url, keysDesired} = serviceConfig;

    return class extends React.Component {
        
        constructor(props) {
            super(props);
            this.state = {data: null, keysDesired: null};
            this.selectItem = this.selectItem.bind(this);
        }

        componentDidMount() {
            
            haxios.get(url)
                .then((d) => {
                    this.setState({data: d, keysDesired});
                })
                .catch((e) => {
                    console.log('Error: ', e)
                });
        }
    
        selectItem(event) { //target->id
            let id = event.target.id.replace('item_', '');
            let selected = this.state.data.find((o) => o.id.toString() === id);
            console.log('selected: ', selected);
        }

        render() {
            let {data, keysDesired} = this.state;
    
            if (data) {
                return (
                    <Comp 
                        data={data} 
                        keysDesired={keysDesired}
                        selectItem={this.selectItem} 
                    /> 
                );
            } else {
                return (<p>Loading...</p>)
            }
        }
    }  
}

export function ListFromData({data, keysDesired, selectItem}) {
    let dataToUse = data.map((o) => {
        let obj = {id: o.id};
        keysDesired.forEach((k) => {
            obj[k] = o[k];
        });
        return obj;
    });
    let dataMarkup = dataToUse.map((o) => {
        return (
            <div 
                onClick={selectItem ? selectItem : null} 
                style={{border: '1px solid', margin: '1em', padding: '1em', cursor: 'pointer'}} 
                key={o.id}
                id={`item_${o.id}`}
            >
            {
                Object.keys(o).filter((k) => k !== 'id').map((k) => {
                    return (
                        <p style={{pointerEvents: 'none'}} key={o[k]}>{o[k]}</p>
                    );
                })
            }
            </div>
        );
 
    });
    return (
        <div>
            {dataMarkup}
        </div>
    );
}
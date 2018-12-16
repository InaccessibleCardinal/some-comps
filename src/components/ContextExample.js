import React, {Component} from 'react';

const contextObj = {
    a: 42,
    b: [1, 2, 3],
    c: 'some string',
    updateContext: function() {} //for this we must handle in the parent
}

const ExampleContext = React.createContext(contextObj);

export default class ContextExample extends Component {

    render() {
        return (
            <ExampleContext.Provider value={this.props}>
                <DirectClassConsumer />
                <Parent />
            </ExampleContext.Provider>
        );
    }
}
ContextExample.contextType = ExampleContext;

class DirectClassConsumer extends Component {
    render() {
        let context = this.context;
        return (
            <div>
                <h2>Class child consumer:</h2>
                <div style={{padding: '1em', color: '#fff', backgroundColor: '#000'}}>
                    <pre>
                        {JSON.stringify(context, null, 2)}
                    </pre>
                </div>
            </div>
        );
    }
}
DirectClassConsumer.contextType = ExampleContext;

class Parent extends Component {
    render() {
        return (
            <div>
                <p>some other components...</p>
                <hr />
                {Child()}
            </div>
        );
    }
}

function Child(props) {
    return (
        <ExampleContext.Consumer>
            {({a, updateContext}) => {
                return (
                    <div>
                        <h2 onClick={updateContext}>Functional child consumer:</h2>
                        <p>{a}</p>
                    </div>
                )
            }
            }
        </ExampleContext.Consumer>
    );
}
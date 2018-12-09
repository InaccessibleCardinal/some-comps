import React from 'react';
/*Simple short circuiting example*/
export default class ShowHide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showingPanel: false}
        this.showPanel = this.showPanel.bind(this);
    }
    showPanel() {
        this.setState({showingPanel: !this.state.showingPanel});
    }
    render() {
        const {showingPanel} = this.state;
        return (
            <div>
                <button onClick={this.showPanel}>{showingPanel ? 'Hide' : 'Show'}</button>
                {showingPanel && <Panel />}
            </div>
        );
    }
}

function Panel() {
    const panelStyle = {width: '80%', height: '200px', border: '1px solid', backgroundColor: '#d7d7d7'};
    return (
        <div style={panelStyle}>Hello World</div>
    );
}
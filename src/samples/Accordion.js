import React, {Component} from 'react';
import {accordionContent} from './accordionContent';


export default class Accordion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accordionContent: accordionContent,
            expandedPanel: null
        }
        this.expandPanel = this.expandPanel.bind(this);    
    }

    expandPanel(id) {
        
        let panelToExpand = this.state.accordionContent.find((panel) => panel.id === id);
        this.setState({
            expandedPanel: panelToExpand
        });
    }

    render() {

        let {accordionContent, expandedPanel} = this.state;
        let accordionMarkup = accordionContent.map((panel) => {
            let {header, content, id} = panel;
            let expanded = expandedPanel === panel;
            return (
                <AccordionItem
                    key={id}
                    header={header}
                    content={content}
                    id={id}
                    expanded={expanded}
                    expandPanel={this.expandPanel.bind(null, id)}                                                        
                />
            );
        });


        return (
            <div>
                {accordionMarkup}
            </div>
        );
    }
}

function AccordionItem(props) {
    let {header, content, id, expanded, expandPanel} = props;
    
    return (
        <div>
            <h3 
                id={`acc-header_${id}`} 
                className={expanded ? 'accordion-header expanded' : 'accordion-header'}
                onClick={expandPanel}
            >
                {header}
            </h3>
            <div className={expanded ? 'accordion expanded' : 'accordion closed'}>
                {expanded && <p className="accordion-content">{content}</p>}
            </div>
        </div>
    );
}

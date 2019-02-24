import React, {Component} from 'react';
import {accordionContent} from './accordionContent';


export default class Accordion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            views: accordionContent,
            expandedView: null
        }
        this.expandView = this.expandView.bind(this);
    }

    expandView(e) {
        let {target} = e;
        let {views} = this.state;
        let nextExpandedView = views.find((v) => v.id === target.id);
        this.setState({
            expandedView: nextExpandedView
        });
    }

    render() {
        let {views, expandedView} = this.state;
        let viewsMarkup = views.map((v) => {

            let {id, content, header} = v;
            let expanded = expandedView && expandedView.id === id;
            return (
                <AccordionItem
                    key={id}
                    id={id}
                    header={header}
                    content={content}
                    expand={this.expandView}
                    expanded={expanded}
                />
            );

        });

        return (
            <div>
                {viewsMarkup}
            </div>
        );
    }
}

function AccordionItem(props) {
    let {expanded, header, content, id, expand} = props;
    return (
        <div>
            <h3 id={id} className={expanded ? 'accordion-header expanded' : 'accordion-header'} onClick={expand}>{header}</h3>
            <div className={expanded ? 'accordion expanded' : 'accordion closed'}>
                {expanded && <p className="accordion-content">{content}</p>}
            </div>
        </div>
    );
}

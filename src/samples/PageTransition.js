import React, {Component} from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

export default class PageTransition extends Component {

    constructor(props) {
        super(props);
        let {pagesArray} = props;
        
        this.state = {
            pages: pagesArray,
            numberOfPages: pagesArray.length,
            currentPage: 0,
            direction: ''
        }
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
    }

    next() {
        let {currentPage, numberOfPages} = this.state;
        if (currentPage < numberOfPages - 1) {
            this.setState({currentPage: currentPage + 1, direction: 'right'});
        }
    }

    previous() {
        let {currentPage} = this.state;
        if (currentPage > 0) {
            this.setState({currentPage: currentPage - 1, direction: 'left'});
        }
    }

    render() {
        let {currentPage, pages, direction} = this.state;
        let l = pages.length; 
        let moving = `move-${direction}`;
        let {children} = this.props;
        let childMarkup = children.map((child, index) => {
            let {id} = child.props;
            if (index === currentPage) {
                return (
                        <CSSTransition 
                            key={id} 
                            timeout={400} 
                            classNames={moving}
                        >
                            {child}
                        </CSSTransition>
                );
            }
            return null;
            
        });
        return (
            <div>
                <div>
                    <h1>{pages[currentPage]}</h1>
                </div>
                <div style={{overflow: 'hidden', height: '300px'}}>
                <TransitionGroup className="mylist">
                    {childMarkup}
                </TransitionGroup>
                </div>
                <div>
                    <button disabled={currentPage === 0} onClick={this.previous}>Previous</button>
                    <button disabled={currentPage === l - 1} onClick={this.next}>Next</button>
                </div>
            </div>
        );
    }
}


const wrapperStyle = {height: '300px', position: 'relative'}
const contentStyle = {width: '80%', margin: 'auto', backgroundColor: '#fff', border: '1px solid #dedede'};
const hStyle = {margin: '15px auto', width: '90%', padding: '10px'};
const pStyle = {backgroundColor: '#dedede', margin: '15px auto', width: '80%', padding: '10px'};
export function Page({hText, pText}) {
    return (
        <div style={wrapperStyle}>
            <div style={contentStyle}>
                <h2 style={hStyle}>{hText}</h2>
                <p style={pStyle}>{pText}</p>
            </div>
        </div>
    );
}
import React, {Component} from 'react';

//import hoistStatics from 'hoist-non-react-statics'
//import withClass, {classyWithExtra} from './functionalHOC';
//import TabbedInterface from './TabbedInterface';
// function Cell(props) {
//     let {text, classProp} = props;
//     return (
//         <li className={classProp? classProp: 'default'}>
//             {text}
//         </li>
//     );
// }


// let p = {text: 'some mo text', classProp: 'fancy'};
// let MyCell = withClass(p, Cell);
// let MyOtherCell = classyWithExtra({text: 'classy'})(Cell);

// console.log('MyCell: ', MyCell)
// import Accordion from './Accordion';
// import SortableTable from './SortableTable';
// import NetworkRequests from './NetworkRequests';
import PageTransition, {Page} from './PageTransition';

let pagesData = [
    {hText: 'headline 1', pText: 'para 1', id: '1', name: 'Page 1'},
    {hText: 'headline 2', pText: 'para 2', id: '2', name: 'Page 2'},
    {hText: 'headline 3', pText: 'para 3', id: '3', name: 'Page 3'},
    {hText: 'headline 4', pText: 'para 4', id: '4', name: 'Page 4'},
    {hText: 'headline 5', pText: 'para 5', id: '5', name: 'Page 5'}
];


export default class Pages extends Component {

    render() {
        let pageNames = [];
        let pages = pagesData.map((p) => {
            let {id, pText, hText, name} = p;
            pageNames.push(name);
            return (
                <Page 
                    key={id} 
                    id={id}
                    pText={pText} 
                    hText={hText}
                    name={name} 
                />
            );
        });
        
        return (
            <div>
                <PageTransition pagesArray={pageNames}>
                    {pages}
                </PageTransition>
            </div>
        );
    }
    
}
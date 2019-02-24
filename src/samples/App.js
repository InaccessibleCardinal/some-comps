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
import Accordion from './Accordion';
// import SortableTable from './SortableTable';
import NetworkRequests from './NetworkRequests';

export default class App extends Component {

    render() {
        
        return (
            <div>
                <Accordion />
            </div>
        );
    }
    
}

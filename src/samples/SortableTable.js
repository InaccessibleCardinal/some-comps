import React, {Component} from 'react';
import {tableData as d1, tableData2 as d2} from './tableData';

let asc = 1;

export default class SortableTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: d2,
            arrow: '',
            sortingBy: ''
        };
        this.sort = this.sort.bind(this);
    }

    sort(e) {
        let {target} = e;
        let {tableData} = this.state;
        let {rows, headers} = tableData;
        let headerToSortBy = target.id.replace('th-', '');
        rows.sort((a, b) => {
            let aV = a[headerToSortBy];
            let bV= b[headerToSortBy];
            return this.multiTypeSort(aV, bV);   
        });
        asc *= -1;
        let newArrow = asc > 0 ? '0x2B9D' : '0x2B9F';
        this.setState({
            tableData: tableData, 
            arrow: newArrow,
            sortingBy: headerToSortBy
        });
    }

    multiTypeSort(a, b) {

        if (asc > 0) {

            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            } else {
                return 0;
            }

        } else {

            if (a > b) {
                return -1;
            } else if (a < b) {
                return 1;
            } else {
                return 0;
            }

        }
    }


    render() {
        let {tableData, arrow, sortingBy} = this.state;
        let {headers, rows} = tableData;
        let rowsMarkup = rows.map((row) => {
            return (
                <TableRow key={row.id} headers={headers} row={row} />
            );
        });
        return (
            <table className="sortable-table">
                <tbody>
                    <TableHeaders 
                        headers={headers} 
                        sortFn={this.sort}
                        arrow={arrow}
                        sortingBy={sortingBy} 
                    />
                    {rowsMarkup}
                </tbody>
            </table>
        );
    }
}
//TableHeaders.js
function TableHeaders(props) {
    let {headers, sortFn, arrow, sortingBy} = props;
    let width = 100/headers.length;

    let headersMarkup = headers.map((h, i) => {
        let a;
        if (sortingBy === h) {
            a = arrow.length ? String.fromCharCode(arrow) : arrow;
        } else {
            a = '';
        }

        return (
            <th 
                key={i}
                id={`th-${h}`} 
                onClick={sortFn}
                width={width}
            >
                {`${h} ${a}`}
            </th>  
        );
    });
    return (
        <tr>
            {headersMarkup}
        </tr>
    );
}
//TableRow.js
function TableRow(props) {

    let {row, headers} = props;
    let rowMarkup = headers.map((h) => {
        let value = row[h];
        let key = `${row[h]}_${row.id}`;
        return (
            <td key={key}>{row[h]}</td>
        );
    });
    return (
        <tr>
            {rowMarkup}
        </tr>
    );
}
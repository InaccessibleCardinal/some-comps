import React from 'react';
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux';
import getDataFromService from '../redux/actions/getDataFromService';
import {getUsers, getSelectedUsers} from '../redux/reducers/usersReducer';

//a couple action creators
function addToSelectedAction(id) {
    return {type: 'ADD_TO_SELECTED', payload: id};
}
function removeFromSelectedAction(id) {
    return {type: 'REMOVE_FROM_SELECTED', payload: id};
}

//a "container" or connected component
class UsersContainer extends React.Component {
    componentDidMount() {
        let {getDataFromService} = this.props;
        getDataFromService('GET_USERS');
    }

    addToSelected = (e) => {
        this.props.addToSelected(Number(e.target.id));
    }
    removeFromSelected = (e) => {
        this.props.removeFromSelected(Number(e.target.id));
    }
    render() {
        console.log('rendering')
        let {users, selectedUsers} = this.props;
        return (
            <div style={{display: 'flex'}}>
                <UsersList users={users} add={this.addToSelected} />
                <SelectedUsersList selectedUsers={selectedUsers} remove={this.removeFromSelected} />
            </div>
        );
    }
}

function mapState(state) {
    return {
        users: getUsers(state),
        selectedUsers: getSelectedUsers(state)
    };
}
function mapDispatch(dispatch) {
    return bindActionCreators({
        getDataFromService,
        addToSelected: addToSelectedAction,
        removeFromSelected: removeFromSelectedAction
    }, dispatch);
}

const UsersWithRedux = connect(mapState, mapDispatch)(UsersContainer);

export default UsersWithRedux;

//some "dumb" components
function UsersList({users, add}) {
    let markup = users.map((u) => <div onClick={add} key={u.id}><p id={u.id}>{u.name}</p></div>);
    return (
        <div>
            <h1>Users: </h1>
            {markup}
        </div>
    );
}
function SelectedUsersList({selectedUsers, remove}) {
    let markup = selectedUsers.map((u) => <div onClick={remove} key={u.id}><p id={u.id}>{u.name}</p></div>);
    return (
        <div>
            <h1>Selected Users: </h1>
            {markup}
        </div>
    );
}
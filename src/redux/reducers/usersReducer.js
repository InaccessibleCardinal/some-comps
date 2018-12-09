const initialState = {users: [], selectedUsers: []};

export default function usersReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_USERS_REQUEST': {
            return state;
        }

        case 'GET_USERS_SUCCESS': {
            return {...state, users: action.payload};
        }

        case 'GET_USERS_ERROR': {
            return state;
        }

        case 'ADD_TO_SELECTED': {
            let {users, selectedUsers} = state;
            let userToAdd = users.find((u) => u.id === action.payload);
            if (selectedUsers.indexOf(userToAdd) < 0) {
                let newSelectedUsers = selectedUsers.concat([userToAdd]);
                return {...state, selectedUsers: newSelectedUsers};
            }
            return state; //otherwise do nothing
        }

        case 'REMOVE_FROM_SELECTED': {
            let {selectedUsers} = state;
            let userToRemove = selectedUsers.find((u) => u.id === action.payload);
            if (exists(userToRemove)) {
                let len = selectedUsers.length;
                let index = selectedUsers.indexOf(userToRemove);
                let newSelectedUsers = selectedUsers.slice(0, index).concat(selectedUsers.slice(index + 1, len));
                return {...state, selectedUsers: newSelectedUsers};
            }
            return state; //otherwise do nothing
        }

        default: {
            return state;
        }

    }
}
export function getUsers(state) {
    return state.usersState.users;
}
export function getSelectedUsers(state) {
    return state.usersState.selectedUsers;
}

function exists(o) {
    if (o === null || typeof o === 'undefined') {
        return false;
    } else {
        return true;
    }
}
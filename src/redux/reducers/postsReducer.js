const initialState = {
    posts: []
};

export default function postsReducer(state = initialState, action) {
    switch(action.type) {
        case 'GET_POSTS': {
            return state;
        }
        case 'GET_POSTS_SUCCESS': {
            return {...state, posts: action.payload};
        }
        case 'GET_POSTS_ERROR': {
            return state;
        }
        default: {
            return state;
        }
    }
}

export function getPosts(state) {
    return state.postsState.posts;
}

export function getPostsByUser(state) {
    let {selectedUsers} = state.usersState;
    
    if (selectedUsers.length > 0) {
        let {posts} = state.postsState;
        let postsByUser = selectedUsers.map((u) => {
            return {
                name: u.name,
                id: u.id,
                userPosts: posts.filter((p) => p.userId === u.id)
            };
        });
        return postsByUser;
    } else {
        return [];
    }
    
}
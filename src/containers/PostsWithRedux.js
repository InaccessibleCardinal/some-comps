import React from 'react';
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux';
import getDataFromService from '../redux/actions/getDataFromService';
import {getPosts, getPostsByUser} from '../redux/reducers/postsReducer';

class PostsContainer extends React.Component {
    state = {okToRender: false, selectedOkToRender: false};

    componentDidMount() {
        this.props.getDataFromService('GET_POSTS');
    }
    componentWillReceiveProps(nextProps) {
        
        if (nextProps.posts !== this.props.posts) {
            
            this.setState({
                okToRender: true
            });
        }
        if (nextProps.postsByUser !== this.props.postsByUser) {
    
            this.setState({
                selectedOkToRender: true
            });
        }
    }
    render() {
        let {okToRender, selectedOkToRender} = this.state;
        let {posts, postsByUser} = this.props;

        return (
            <div style={{display: 'flex'}}>
                {okToRender ? <PostsList posts={posts} /> : <div><p>Loading posts...</p></div>}
                {selectedOkToRender ? <PostsBySelectedUsers userPostList={postsByUser} /> : <div><p>Nothing to show.</p></div>}
            </div>
        );
    }
}

function mapState(state) {
    return {
        posts: getPosts(state),
        postsByUser: getPostsByUser(state)
    };
}
function mapDispatch(dispatch) {
    return bindActionCreators({
        getDataFromService
    }, dispatch);
}

const PostsWithRedux = connect(mapState, mapDispatch)(PostsContainer);

export default PostsWithRedux;

function PostsList({posts}) {
    let postsMarkup = posts.map((p) => {
        return (
            <div key={p.id}>
                <p>{p.title}</p>
                <p>{p.body}</p>
            </div>
        );
    });
    return (
        <div style={{width: '50%'}}>
            <h2>Posts: </h2>
            {postsMarkup}
        </div>
    );
}

function PostsBySelectedUsers({userPostList}) {
    let uplMarkup = userPostList.map((usersPosts) => {
        let postsMarkup = usersPosts.userPosts.map((p) => {
            return (
                <div key={p.id}>
                    <p>{p.title}</p>
                    <p>{p.body}</p>
                </div>
            );
        }); 
        return (
            <div key={usersPosts.id}>
                <h3>{usersPosts.name}</h3>
                <h4>Posts: </h4>
                {postsMarkup}
            </div>
        );
    });
    return (
        <div style={{width: '50%'}}>
            {uplMarkup}
        </div>
    );
}
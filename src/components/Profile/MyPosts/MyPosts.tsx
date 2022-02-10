import React from "react";
import s from './MyPosts.module.css';
import Post, {PostPropsType} from "./Post/Post";

type MyPostsPropsType = {
    postsData: Array<PostPropsType>
}

const MyPosts = (props: MyPostsPropsType) => {
    const postElements = props.postsData.map( p => <Post id={p.id} message={p.message} likeCount={p.likeCount}/>);

    return (
        <div className={s.postsBlock}>
            <h3>My posts</h3>
            <div>
                <div>
                    <textarea/>
                </div>
                <div>
                    <button>Add post</button>
                </div>
            </div>
            <div className={s.posts}>
                {postElements}
            </div>
        </div>
    );
};


export default MyPosts;
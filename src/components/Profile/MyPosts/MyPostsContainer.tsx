import MyPosts from "./MyPosts";
import {addPost, ProfileReducerStateType} from "../../../redux/profile-reducer";
import {connect} from "react-redux";
import {AppRootStateType} from "../../../redux/redux-store";


type MapStateToPropsType = {
    profilePage: ProfileReducerStateType
}

type MapDispatchToPropsType = {
    addPost: (newPostText: string) => void
}

export type MyPostsPropsType = MapStateToPropsType & MapDispatchToPropsType


const mapStateToProps = (state: AppRootStateType) : MapStateToPropsType => {
    return {
        profilePage: state.profilePage
    }
}

export const MyPostsContainer = connect(mapStateToProps, {addPost})(MyPosts);


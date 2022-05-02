import {PostType} from "../components/Profile/MyPosts/Post/Post";
import {SendMessageActionType, UpdateNewMessageBodyActionType} from "./dialogs-reducer";
import {UserProfileType} from "../components/Profile/ProfileContainer";
import {profileAPI, ProfileDataResponseType} from "../api/api";
import {ThunkAction, ThunkDispatch} from "redux-thunk";


export type AddPostActionType = {
    type: 'ADD-POST'
}

export type UpdateNewPostTextActionType = {
    type: 'UPDATE-NEW-POST-TEXT'
    newText: string
}

export type SetUserProfileActionType = {
    type: 'SET_USER_PROFILE'
    profile: UserProfileType
}

export type SetStatusActionType = {
    type: "SET_STATUS"
    status: string
}

export type toggleIsFetchingActionType = {
    type: 'TOGGLE_IS_FETCHING'
    isFetching: boolean
}

export type ActionsTypes = AddPostActionType
    | UpdateNewPostTextActionType
    | UpdateNewMessageBodyActionType
    | SendMessageActionType
    | SetUserProfileActionType
    | SetStatusActionType
    | toggleIsFetchingActionType


export type ProfileReducerStateType = {
    posts: Array<PostType>
    newPostText: string
    profile: UserProfileType | null
    status: string
    isFetching: boolean
}

let initialState: ProfileReducerStateType = {
    posts: [
        {id: 1, message: 'My first post', likeCount: 13},
        {id: 2, message: 'I want to be a frontend developer', likeCount: 15}
    ] as Array<PostType>,
    newPostText: '',
    profile: {
        aboutMe: 'I want tobe a frontend developer',
        contacts: {
            facebook: 'none',
            github: 'https://github.com/Ilya030290',
            instagram: 'https://instagram.com/',
            mainLink: 'none',
            vk: 'none',
            twitter: 'none',
            website: 'none',
            youtube: 'none'
        },
        fullName: 'Ilya Anoshko',
        lookingForAJob: true,
        lookingForAJobDescription: 'I look for a new job, help me please',
        photos: {
            large: null,
            small: null
        },
        userId: 230
    },
    status: "",
    isFetching: false
}

export const profileReducer = (state: ProfileReducerStateType = initialState, action: ActionsTypes): ProfileReducerStateType => {

    switch (action.type) {
        case 'ADD-POST':
            return {
                ...state,
                newPostText: '',
                posts: [{id: new Date().getTime(), message: state.newPostText, likeCount: 0}, ...state.posts]
            };
        case "UPDATE-NEW-POST-TEXT":
            return {...state, newPostText: action.newText};
        case "SET_USER_PROFILE":
            return {...state, profile: action.profile};
        case "SET_STATUS":
            return {...state, status: action.status};
        case 'TOGGLE_IS_FETCHING':
            return {...state, isFetching: action.isFetching};
        default:
            return state;
    }
}

export const addPost = (): AddPostActionType => ({type: 'ADD-POST'})
export const updateNewPostText = (text: string): UpdateNewPostTextActionType => ({
    type: 'UPDATE-NEW-POST-TEXT',
    newText: text
})
export const setUserProfile = (profile: UserProfileType): SetUserProfileActionType => ({
    type: 'SET_USER_PROFILE',
    profile: profile
})
export const setStatus = (status: string): SetStatusActionType => ({type: "SET_STATUS", status})
export const toggleIsFetching = (isFetching: boolean): toggleIsFetchingActionType => ({
    type: 'TOGGLE_IS_FETCHING',
    isFetching: isFetching
});

//ThunkCreator

export type DispatchProfileType = ThunkDispatch<ProfileReducerStateType, unknown, ActionsTypes>;
export type ThunkProfileType = ThunkAction<void, ProfileReducerStateType, unknown, ActionsTypes>;


export const getUserProfile = (userId: number | undefined): ThunkProfileType => {
    return (dispatch: DispatchProfileType) => {
        dispatch(toggleIsFetching(true));
        profileAPI.getProfile(userId)
            .then((data: ProfileDataResponseType) => {
                dispatch(setUserProfile(data));
                dispatch(toggleIsFetching(false));
            });
    }
}

export const getUserStatus = (userId: number | undefined): ThunkProfileType => {
    return (dispatch: DispatchProfileType) => {
        dispatch(toggleIsFetching(true));
        profileAPI.getStatus(userId)
            .then((response) => {
                if (response.data) {
                    dispatch(setStatus(response.data));
                } else {
                    dispatch(setStatus('Null'));
                    dispatch(toggleIsFetching(false));
                }
            });
    }
}

export const updateUserStatus = (status: string): ThunkProfileType => {
    return (dispatch: DispatchProfileType) => {
        profileAPI.updateStatus(status)
            .then((response) => {
                if (response.data.resultCode == 0) {
                    dispatch(setStatus(status));
                }
            });
    }
}
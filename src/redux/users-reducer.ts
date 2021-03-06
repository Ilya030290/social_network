import {usersAPI, UsersDataResponseType} from "../api/api";
import {DispatchType, ThunkType} from "./redux-store";

export type UserType = {
    id: number
    photos: {
        small: string | null,
        large: string | null
    }
    followed: boolean
    name: string
    status: string | null
    uniqueUrlName: string | null
}

export type followActionType = {
    type: 'FOLLOW'
    userId: number
}

export type unFollowActionType = {
    type: 'UNFOLLOW'
    userId: number
}

export type setUsersActionType = {
    type: 'SET_USERS'
    users: Array<UserType>
}

export type setCurrentPageActionType = {
    type: 'SET_CURRENT_PAGE'
    currentPage: number
}

export type setTotalUsersCountActionType = {
    type: 'SET_TOTAL_USERS_COUNT'
    totalUsersCount: number
}

export type toggleIsFetchingActionType = {
    type: 'TOGGLE_IS_FETCHING'
    isFetching: boolean
}

export type toggleFollowingInProgressActionType = {
    type: 'TOGGLE_IS_FOLLOWING_PROGRESS'
    followingInProgress: boolean
    userId: number
}

export type UsersReducerActionsTypes = followActionType
    | unFollowActionType
    | setUsersActionType
    | setCurrentPageActionType
    | setTotalUsersCountActionType
    | toggleIsFetchingActionType
    | toggleFollowingInProgressActionType

export type UsersReducerStateType = {
    users: Array<UserType>,
    pageSize: number,
    totalUsersCount: number,
    currentPage: number,
    isFetching: boolean,
    followingInProgress: Array<number>
}

let initialState: UsersReducerStateType = {
    users: [] as Array<UserType>,
    pageSize: 5,
    totalUsersCount: 0,
    currentPage: 1,
    isFetching: true,
    followingInProgress: []
};

export const usersReducer = (state: UsersReducerStateType = initialState, action: UsersReducerActionsTypes): UsersReducerStateType => {
    switch (action.type) {
        case 'FOLLOW':
            return {...state, users: state.users.map(u => u.id === action.userId ? {...u, followed: true} : u)};
        case 'UNFOLLOW':
            return {...state, users: state.users.map(u => u.id === action.userId ? {...u, followed: false} : u)};
        case 'SET_USERS':
            return {...state, users: action.users};
        case 'SET_CURRENT_PAGE':
            return {...state, currentPage: action.currentPage};
        case 'SET_TOTAL_USERS_COUNT':
            return {...state, totalUsersCount: action.totalUsersCount};
        case 'TOGGLE_IS_FETCHING':
            return {...state, isFetching: action.isFetching};
        case 'TOGGLE_IS_FOLLOWING_PROGRESS':
            return {
                ...state, followingInProgress: action.followingInProgress
                    ? [...state.followingInProgress, action.userId]
                    : state.followingInProgress.filter(id => id !== action.userId)
            };
        default:
            return state;
    }
}

export const follow = (userId: number): followActionType => ({type: 'FOLLOW', userId: userId});
export const unFollow = (userId: number): unFollowActionType => ({type: 'UNFOLLOW', userId: userId});
export const setUsers = (users: Array<UserType>): setUsersActionType => ({type: 'SET_USERS', users: users});
export const setCurrentPage = (currentPage: number): setCurrentPageActionType => ({
    type: 'SET_CURRENT_PAGE',
    currentPage: currentPage
});
export const setTotalUsersCount = (totalUsersCount: number): setTotalUsersCountActionType => ({
    type: 'SET_TOTAL_USERS_COUNT',
    totalUsersCount: totalUsersCount
});
export const toggleIsFetching = (isFetching: boolean): toggleIsFetchingActionType => ({
    type: 'TOGGLE_IS_FETCHING',
    isFetching: isFetching
});
export const toggleFollowingInProgress = (followingInProgress: boolean, userId: number): toggleFollowingInProgressActionType => ({
    type: 'TOGGLE_IS_FOLLOWING_PROGRESS',
    followingInProgress: followingInProgress,
    userId: userId
});


//ThunkCreators

export const getUsersThunk = (currentPage: number, pageSize: number): ThunkType => async (dispatch: DispatchType) => {
    dispatch(setCurrentPage(currentPage));
    dispatch(toggleIsFetching(true));
    const response: UsersDataResponseType = await usersAPI.getUsers(currentPage, pageSize);
    dispatch(toggleIsFetching(false));
    dispatch(setUsers(response.items));
    dispatch(setTotalUsersCount(response.totalCount));
}

const followUnfollowFlow = async (dispatch: DispatchType, userId: number, apiMethod: Function, actionCreator: Function) => {
    dispatch(toggleFollowingInProgress(true, userId));
    let response = await apiMethod(userId);
    if (response.data.resultCode === 0) {
        dispatch(actionCreator(userId));
    }
    dispatch(toggleFollowingInProgress(false, userId));
}

export const followUsers = (userId: number): ThunkType => async (dispatch: DispatchType) => {
    await followUnfollowFlow(dispatch, userId, usersAPI.follow.bind(usersAPI), follow);
}

export const unFollowUsers = (userId: number): ThunkType => async (dispatch: DispatchType) => {
    await followUnfollowFlow(dispatch, userId, usersAPI.unFollow.bind(usersAPI), unFollow);
}
import React, {JSXElementConstructor} from 'react';
import {Profile} from "./Profile";
import {AppRootStateType} from "../../redux/redux-store";
import {connect} from "react-redux";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {WithAuthRedirect} from "../../hoc/WithAuthRedirect";
import {compose} from "redux";
import {Preloader} from "../../common/Preloader/Preloader";
import {getUserProfile, getUserStatus, updateUserStatus} from "../../redux/profile-sagas";


export type UserProfileType = {
    aboutMe: string | null,
    contacts: {
        facebook: string | null,
        website: string | null,
        vk: string | null,
        twitter: string | null,
        instagram: string | null,
        youtube: string | null,
        github: string | null,
        mainLink: string | null
    }
    lookingForAJob: boolean,
    lookingForAJobDescription: string | null,
    fullName: string,
    userId: number | null,
    photos: {
        small: string | null,
        large: string | null
    }
}

type MapStateToPropsType = {
    profile: UserProfileType | null
    status: string
    isFetching: boolean
    authorizedUserId: number | null
    isAuth: boolean
}

type MapDispatchToPropsType = {
    getUserProfile: (userId: number | undefined) => void
    getUserStatus: (userId: (number | undefined)) => void
    updateUserStatus: (status: string) => void
}

export type ProfileContainerComponentPropsType = MapStateToPropsType & MapDispatchToPropsType;


export class ProfileContainerComponent extends React.Component<ProfileContainerComponentPropsType> {

    componentDidMount() {

        // @ts-ignore
        let userId = Number(this.props.router.params.userId);
        if (!userId && this.props.profile) {
            // @ts-ignore
            userId = this.props.authorizedUserId;
        }
        this.props.getUserProfile(userId);
        this.props.getUserStatus(userId);
    }

    render() {

        return (
            <div>
                {this.props.isFetching ? <Preloader/> : null}
                <Profile {...this.props}
                         profile={this.props.profile}
                         status={this.props.status}
                         updateUserStatus={this.props.updateUserStatus}
                />
            </div>
        );
    }
}


const mapStateToProps = (state: AppRootStateType): MapStateToPropsType => {
    return {
        profile: state.profilePage.profile,
        status: state.profilePage.status,
        isFetching: state.profilePage.isFetching,
        authorizedUserId: state.auth.id,
        isAuth: state.auth.isAuth
    }
}

//Оболочка для классовой компоненты, чтоб не откатыватся на 5 версию router-dom
export const WithRouter = (Component: JSXElementConstructor<any>): JSXElementConstructor<any> => {
    function WithRouterPropComponent(props: any) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        return (
            <Component
                {...props}
                router={{location, navigate, params}}
            />
        );
    }

    return WithRouterPropComponent;
}

// для выполнения всё тех же задач использовал ф-цию compose из redux;

export const ProfileContainer = compose<React.ComponentType>(connect(mapStateToProps,
    {getUserProfile, getUserStatus, updateUserStatus}), WithAuthRedirect, WithRouter)(ProfileContainerComponent);
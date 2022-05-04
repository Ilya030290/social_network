import React from "react";
import Header from "./Header";
import {connect} from "react-redux";
import {AuthReducerStateType, getAuthUserData, makeLogOut, setAuthUserData} from "../../redux/auth-reducer";
import {AppStateType} from "../../redux/redux-store";


type HeaderContainerComponentPropsType = AuthReducerStateType & {
    getAuthUserData: () => void
    setAuthUserData: (id: number, email: string, login: string) => void
    makeLogOut: () => void
}


export class HeaderContainerComponent extends React.Component<HeaderContainerComponentPropsType> {

    componentDidMount() {

        this.props.getAuthUserData();
    }

    render () {
        return (
            <Header {...this.props} />
        );
    }
}

const mapStateToProps = (state: AppStateType) => ({
    id: state.auth.id,
    email: state.auth.email,
    login: state.auth.login,
    isAuth: state.auth.isAuth

});

export const HeaderContainer = connect(mapStateToProps,{setAuthUserData, getAuthUserData, makeLogOut})(HeaderContainerComponent);
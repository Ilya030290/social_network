import React from 'react';
import {DialogsReducerStateType, sendMessage} from "../../redux/dialogs-reducer"
import Dialogs from "./Dialogs";
import {connect} from "react-redux";
import {AppRootStateType} from "../../redux/redux-store";
import {WithAuthRedirect} from "../../hoc/WithAuthRedirect";
import {compose} from "redux";


type MapStateToPropsType = {
    dialogsPage: DialogsReducerStateType
}

type MapDispatchToPropsType = {
    sendMessage: (newMessage: string) => void
}

export type DialogsPropsType = MapStateToPropsType & MapDispatchToPropsType


const mapStateToProps = (state: AppRootStateType) : MapStateToPropsType => {
    return {
        dialogsPage: state.dialogsPage
    }
}


// для выполнения всё тех же задач использовал ф-цию compose из redux;

export const DialogsContainer = compose<React.ComponentType>(connect(mapStateToProps, {sendMessage}), WithAuthRedirect)(Dialogs);


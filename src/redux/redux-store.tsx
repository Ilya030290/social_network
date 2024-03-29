import {applyMiddleware, combineReducers, createStore} from "redux";
import {DialogsProfileReducersActionsTypes, profileReducer} from "./profile-reducer";
import {dialogsReducer} from "./dialogs-reducer";
import {sidebarReducer} from "./sidebar-reducer";
import {usersReducer, UsersReducerActionsTypes} from "./users-reducer";
import {authReducer, AuthReducerActionsType} from "./auth-reducer";
import thunkMiddleware from "redux-thunk";
import { reducer as formReducer } from "redux-form";
import {appReducer, AppReducerActionsType} from "./app-reducer";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import createSagaMiddleware from 'redux-saga';
import {profileWatcherSaga} from "./profile-sagas";
import {usersWatcherSaga} from "./users-sagas";
import {all} from 'redux-saga/effects';
import {appWatcherSaga} from "./app-saga";
import {authWatcherSaga} from "./auth-sagas";

export const rootReducer = combineReducers({
    profilePage: profileReducer,
    dialogsPage: dialogsReducer,
    sidebar: sidebarReducer,
    usersPage: usersReducer,
    auth: authReducer,
    app: appReducer,
    form: formReducer
});

export type AppRootStateType = ReturnType<typeof rootReducer>;

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware, sagaMiddleware));

sagaMiddleware.run(rootWatcher);

function* rootWatcher() {
    yield all([
        profileWatcherSaga(),
        usersWatcherSaga(),
        authWatcherSaga(),
        appWatcherSaga()
    ]);
}

export type ThunkType<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionsType>;
export type DispatchType = ThunkDispatch<AppRootStateType, unknown, AppActionsType>;

export type AppActionsType =
    AppReducerActionsType
    | AuthReducerActionsType
    | DialogsProfileReducersActionsTypes
    | UsersReducerActionsTypes;

export type ReduxStoreType = typeof store;
import { takeEvery, call, put, all } from 'redux-saga/effects'

import { USER_LOGIN_REQUEST, USER_LOGOUT } from '../constants/userActionTypes'

import { loginService } from '../services/userServices'
import history from '../history'
import * as userActions from '../actions/userActions'
import { showAlert } from '../actions/alertActions'

function* login({ payload }) {
    try {
        const credentials = payload
        const { data } = yield call(loginService, credentials)
        yield put(userActions.loginSuccess(data))
        history.push('/home')
        yield put(showAlert('success', { messageKey: 'session.welcome', params: { username: data.username } }))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(userActions.loginFail(errorMsg))
        yield put(showAlert('error', { messageKey: 'loginForm.fail' }))
    }
}

function* logout() {
    yield put(userActions.loggedOut())
    history.push('/')
}

function* watchLogin() {
    yield takeEvery(USER_LOGIN_REQUEST, login)
}

function* watchLogout() {
    yield takeEvery(USER_LOGOUT, logout)
}

export function* userSaga() {
    yield all([
        watchLogin(),
        watchLogout()
    ])
}
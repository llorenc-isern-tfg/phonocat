import { takeEvery, call, put, all, select } from 'redux-saga/effects'

import {
    USER_REGISTER_REQUEST, USER_LOGIN_REQUEST,
    USER_LOGOUT, GOOGLE_LOGIN_REQUEST,
    USER_PROFILE_REQUEST,
    USER_UPLOAD_PICTURE_REQUEST,
    USER_EDIT_PROFILE_REQUEST,
    USER_SESSION_EXPIRED
} from '../constants/userActionTypes'

import {
    registerService, loginService, googleLoginService, getUserProfileService,
    uploadProfilePictureService, editUserProfileService
} from '../services/userServices'
import history from '../history'
import * as userActions from '../actions/userActions'
import { showAlert } from '../actions/alertActions'
import { selectUserInfo } from '../reducers/selectors'
import { persistor } from '../store'

function* register({ payload }) {
    try {
        const user = payload
        const { data } = yield call(registerService, user)
        yield put(userActions.registerSuccess(data))
        yield put(showAlert('success', { messageKey: 'session.welcome', params: { username: data.username } }))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(userActions.loginFail(errorMsg))
        if (error.response && error.response.status === 409) {
            if (errorMsg === 'User email already exists')
                yield put(showAlert('error', { messageKey: 'registerForm.userAlreadyExists' }))
            if (errorMsg === 'User name already exists')
                yield put(showAlert('error', { messageKey: 'registerForm.duplicateUserName' }))
        } else {
            yield put(showAlert('error', { messageKey: 'registerForm.fail' }))
        }
    }
}

function* login({ payload }) {
    try {
        const credentials = payload
        const { data } = yield call(loginService, credentials)
        yield put(userActions.loginSuccess(data))
        yield put(showAlert('success', { messageKey: 'session.welcome', params: { username: data.username } }))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(userActions.loginFail(errorMsg))
        yield put(showAlert('error', { messageKey: 'loginForm.fail' }))
    }
}

function* googleLogin({ payload }) {
    try {
        const id_token = payload
        const { data } = yield call(googleLoginService, id_token)
        yield put(userActions.googleLoginSuccess(data))
        yield put(showAlert('success', { messageKey: 'session.welcome', params: { username: data.username } }))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(userActions.googleLoginFail(errorMsg))
        yield put(showAlert('error', { messageKey: 'loginForm.fail' }))
    }
}

function* fetchUserProfile() {
    try {
        const userInfo = yield select(selectUserInfo)
        const { data } = yield call(getUserProfileService, userInfo)
        const user = data
        yield put(userActions.getUserProfileSuccess(user))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(userActions.getUserProfileFail(errorMsg))
    }
}

function* uploadProfilePicture({ payload }) {
    try {
        const { formData } = payload

        const userInfo = yield select(selectUserInfo)
        const { data } = yield call(uploadProfilePictureService, userInfo, formData)
        const profilePic = data
        yield put(userActions.uploadProfilePictureSuccess(profilePic))
        yield put(showAlert('info', { messageKey: 'profile.pictureUploaded' }))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(userActions.uploadProfilePictureFail(errorMsg))
        if (!error.response || error.response.status !== 401)
            yield put(showAlert('error', { messageKey: 'generic.fail' }))
    }
}

function* updateUserProfile({ payload }) {
    try {
        const user = payload
        const userInfo = yield select(selectUserInfo)
        const { data } = yield call(editUserProfileService, userInfo, user)
        yield put(userActions.editProfileSuccess(data))
        yield put(showAlert('success', { messageKey: 'editProfile.success' }))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(userActions.editProfileFail(errorMsg))
        if (!error.response || error.response.status !== 401)
            yield put(showAlert('error', { messageKey: 'editProfile.fail' }))
    }
}

function* logout() {
    yield put(userActions.loggedOut())
    yield persistor.purge()
    history.push('/')
}

function* onSessionExpired() {
    try {
        yield put(userActions.logout())
        yield put(showAlert('warning', { messageKey: 'session.expired' }, 5000))
    } catch (error) {
        console.log(error)
    }
}


function* watchRegister() {
    yield takeEvery(USER_REGISTER_REQUEST, register)
}

function* watchLogin() {
    yield takeEvery(USER_LOGIN_REQUEST, login)
}

function* watchLogout() {
    yield takeEvery(USER_LOGOUT, logout)
}

function* watchGoogleLogin() {
    yield takeEvery(GOOGLE_LOGIN_REQUEST, googleLogin)
}

function* watchUserProfile() {
    yield takeEvery(USER_PROFILE_REQUEST, fetchUserProfile)
}

function* watchUploadProfilePicture() {
    yield takeEvery(USER_UPLOAD_PICTURE_REQUEST, uploadProfilePicture)
}

function* watchUpdateUserProfile() {
    yield takeEvery(USER_EDIT_PROFILE_REQUEST, updateUserProfile)
}

function* watchSessionExpired() {
    yield takeEvery(USER_SESSION_EXPIRED, onSessionExpired)
}

export function* userSaga() {
    yield all([
        watchRegister(),
        watchLogin(),
        watchLogout(),
        watchGoogleLogin(),
        watchUserProfile(),
        watchUploadProfilePicture(),
        watchUpdateUserProfile(),
        watchSessionExpired()
    ])
}
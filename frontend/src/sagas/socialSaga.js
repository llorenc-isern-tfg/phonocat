import { takeEvery, takeLatest, call, put, all, select } from 'redux-saga/effects'

import {
    getUserListService, getUserDetailService, followUserService, unfollowUserService
} from '../services/socialServices'
import * as socialActions from '../actions/socialActions'
import { showAlert } from '../actions/alertActions'
import {
    USER_LIST_REQUEST, USER_DETAIL_REQUEST, USER_FOLLOW_REQUEST, USER_UNFOLLOW_REQUEST
} from '../constants/socialActionTypes'
import { selectUserInfo } from '../reducers/selectors'


function* userList({ payload }) {
    try {
        const params = payload
        const userInfo = yield select(selectUserInfo)
        const { data } = yield call(getUserListService, userInfo, params)
        const users = data
        yield put(socialActions.userListSuccess(users))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(socialActions.userListFail(errorMsg))
        yield put(showAlert('error', { messageKey: 'userList.fail' }))
    }
}

function* userDetail({ payload }) {
    try {
        const username = payload
        const userInfo = yield select(selectUserInfo)
        const { data } = yield call(getUserDetailService, userInfo, username)
        const user = data
        yield put(socialActions.getUserDetailSuccess(user))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(socialActions.getUserDetailFail(errorMsg))
        yield put(showAlert('error', { messageKey: 'userDetail.fail' }))
    }
}

function* followUser({ payload }) {
    try {
        const username = payload
        const userInfo = yield select(selectUserInfo)
        const { data } = yield call(followUserService, userInfo, username)
        if (data.status === "success") {
            yield put(socialActions.followUserSuccess(userInfo))
            yield put(showAlert('info', { messageKey: 'userDetail.followingUser', params: { username } }))
        }
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(socialActions.followUserFail(errorMsg))
        yield put(showAlert('error', { messageKey: 'generic.fail' }))
    }
}

function* unfollowUser({ payload }) {
    try {
        const username = payload
        const userInfo = yield select(selectUserInfo)
        const { data } = yield call(unfollowUserService, userInfo, username)
        if (data.status === "success") {
            yield put(socialActions.unfollowUserSuccess(userInfo.username))
            yield put(showAlert('info', { messageKey: 'userDetail.unfollowingUser', params: { username } }))
        }
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(socialActions.unfollowUserFail(errorMsg))
        yield put(showAlert('error', { messageKey: 'generic.fail' }))
    }
}

function* watchUserList() {
    yield takeLatest(USER_LIST_REQUEST, userList)
}

function* watchUserDetail() {
    yield takeEvery(USER_DETAIL_REQUEST, userDetail)
}

function* watchFollowUser() {
    yield takeEvery(USER_FOLLOW_REQUEST, followUser)
}

function* watchUnfollowUser() {
    yield takeEvery(USER_UNFOLLOW_REQUEST, unfollowUser)
}

export function* socialSaga() {
    yield all([
        watchUserList(),
        watchUserDetail(),
        watchFollowUser(),
        watchUnfollowUser()
    ])
}
import { takeEvery, takeLatest, call, put, all, select } from 'redux-saga/effects'

import { searchAlbumsService } from '../services/lastFmServices'
import {
    getUserListService, getUserDetailService
} from '../services/socialServices'
import * as socialActions from '../actions/socialActions'
import { showAlert } from '../actions/alertActions'
import {
    USER_LIST_REQUEST, USER_DETAIL_REQUEST
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
        alert(JSON.stringify(error))
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
    }
}

function* watchUserList() {
    yield takeLatest(USER_LIST_REQUEST, userList)
}

function* watchUserDetail() {
    yield takeEvery(USER_DETAIL_REQUEST, userDetail)
}

export function* socialSaga() {
    yield all([
        watchUserList(),
        watchUserDetail()
    ])
}
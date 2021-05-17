import {
    USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_LIST_FAIL, USER_LIST_CLEAR,
    USER_DETAIL_REQUEST, USER_DETAIL_SUCCESS, USER_DETAIL_FAIL, USER_DETAIL_CLEAR,
    USER_FOLLOW_REQUEST, USER_FOLLOW_SUCCESS, USER_FOLLOW_FAIL,
    USER_UNFOLLOW_REQUEST, USER_UNFOLLOW_SUCCESS, USER_UNFOLLOW_FAIL
} from '../constants/socialActionTypes'

const action = (type, payload = {}) => ({ type, payload })

export const userListRequest = params => action(USER_LIST_REQUEST, params)
export const userListSuccess = users => action(USER_LIST_SUCCESS, users)
export const userListFail = error => action(USER_LIST_FAIL, error)
export const userListClear = () => action(USER_LIST_CLEAR)

export const getUserDetailRequest = username => action(USER_DETAIL_REQUEST, username)
export const getUserDetailSuccess = user => action(USER_DETAIL_SUCCESS, user)
export const getUserDetailFail = error => action(USER_DETAIL_FAIL, error)
export const userDetailClear = error => action(USER_DETAIL_CLEAR, error)

export const followUserRequest = username => action(USER_FOLLOW_REQUEST, username)
export const followUserSuccess = userInfo => action(USER_FOLLOW_SUCCESS, userInfo)
export const followUserFail = error => action(USER_FOLLOW_FAIL, error)

export const unfollowUserRequest = username => action(USER_UNFOLLOW_REQUEST, username)
export const unfollowUserSuccess = username => action(USER_UNFOLLOW_SUCCESS, username)
export const unfollowUserFail = error => action(USER_UNFOLLOW_FAIL, error)
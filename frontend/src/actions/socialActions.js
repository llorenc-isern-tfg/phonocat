import {
    USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_LIST_FAIL, USER_LIST_CLEAR,
    USER_DETAIL_REQUEST, USER_DETAIL_SUCCESS, USER_DETAIL_FAIL
} from '../constants/socialActionTypes'

const action = (type, payload = {}) => ({ type, payload })

export const userListRequest = (params) => action(USER_LIST_REQUEST, params)
export const userListSuccess = (users) => action(USER_LIST_SUCCESS, users)
export const userListFail = error => action(USER_LIST_FAIL, error)
export const userListClear = () => action(USER_LIST_CLEAR)

export const getUserDetailRequest = () => action(USER_DETAIL_REQUEST)
export const getUserDetailSuccess = (user) => action(USER_DETAIL_SUCCESS, user)
export const getUserDetailFail = error => action(USER_DETAIL_FAIL, error)
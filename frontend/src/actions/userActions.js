import {
    USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS,
    USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL,
    USER_LOGOUT, USER_LOGGGED_OUT
} from "../constants/userActionTypes"

const action = (type, payload = {}) => ({ type, payload })

export const loginRequest = credentials => (action(USER_LOGIN_REQUEST, credentials))
export const loginSuccess = user => (action(USER_LOGIN_SUCCESS, user))
export const loginFail = error => (action(USER_LOGIN_FAIL, error))

export const logout = () => (action(USER_LOGOUT))
export const loggedOut = () => (action(USER_LOGGGED_OUT))
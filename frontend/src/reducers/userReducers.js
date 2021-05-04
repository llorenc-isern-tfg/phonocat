import { USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_LOGGGED_OUT } from "../constants/userActionTypes"


export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { ...state, loading: true }
        case USER_LOGIN_SUCCESS:
            return { ...state, loading: false, userInfo: action.payload }
        case USER_LOGIN_FAIL:
            return { ...state, loading: false, error: action.payload }
        case USER_LOGOUT:
            return { ...state, loading: true }
        case USER_LOGGGED_OUT:
            return {}
        default:
            return state
    }
}

export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { loading: true }
        case USER_LOGIN_SUCCESS:
            return { loading: false, userInfo: action.payload }
        case USER_LOGIN_FAIL:
            console.log('LOGIN FAIL')
            return { loading: false, error: action.payload }
        case USER_LOGOUT:
            return {}
        default:
            return state
    }
}
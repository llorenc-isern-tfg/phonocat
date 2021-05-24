import {
    USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS,
    USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_LOGGGED_OUT,
    GOOGLE_LOGIN_REQUEST, GOOGLE_LOGIN_SUCCESS, GOOGLE_LOGIN_FAIL,
    USER_PROFILE_REQUEST, USER_PROFILE_SUCCESS, USER_PROFILE_FAIL,
    USER_UPLOAD_PICTURE_REQUEST, USER_UPLOAD_PICTURE_SUCCESS, USER_UPLOAD_PICTURE_FAIL,
    USER_EDIT_PROFILE_REQUEST, USER_EDIT_PROFILE_SUCCESS, USER_EDIT_PROFILE_FAIL
} from "../constants/userActionTypes"


export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
        case USER_LOGIN_REQUEST:
        case GOOGLE_LOGIN_REQUEST:
            return { ...state, loading: true }
        case USER_REGISTER_SUCCESS:
        case USER_LOGIN_SUCCESS:
        case GOOGLE_LOGIN_SUCCESS:
            return { ...state, loading: false, userInfo: action.payload }
        case USER_REGISTER_FAIL:
        case USER_LOGIN_FAIL:
        case GOOGLE_LOGIN_FAIL:
            return { ...state, loading: false, error: action.payload }
        case USER_LOGOUT:
            return { ...state, loading: true }
        case USER_LOGGGED_OUT:
            return {}
        //Si s'actualitza el perfil refresquem l'avatar i l'idioma
        case USER_UPLOAD_PICTURE_SUCCESS:
            return { ...state, userInfo: { ...state.userInfo, picture: action.payload.url } }
        case USER_EDIT_PROFILE_SUCCESS:
            return { ...state, userInfo: { ...state.userInfo, picture: action.payload.picture, language: action.payload.language } }
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
            return { loading: false, error: action.payload }
        case USER_LOGGGED_OUT:
            return {}
        default:
            return state
    }
}

export const userProfileReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_PROFILE_REQUEST:
            return { ...state, status: { loading: true, type: action.type } }
        case USER_PROFILE_SUCCESS:
            return { ...state, status: { loading: false, type: action.type }, user: action.payload }
        case USER_PROFILE_FAIL:
            return { ...state, status: { loading: false, type: action.type }, error: action.payload }
        // case USER_PROFILE_CLEAR:
        //     return {}
        case USER_UPLOAD_PICTURE_REQUEST:
            return { ...state, editCover: { loading: true, formData: action.payload } }
        case USER_UPLOAD_PICTURE_SUCCESS:
            return { ...state, editCover: { loading: false, response: action.payload }, user: { ...state.user, picture: action.payload.url } }
        case USER_UPLOAD_PICTURE_FAIL:
            return { ...state, editCover: { loading: false, error: action.payload } }
        case USER_EDIT_PROFILE_REQUEST:
            return { ...state, editUser: { loading: true, formData: action.payload } }
        case USER_EDIT_PROFILE_SUCCESS:
            return { ...state, editUser: { loading: false }, user: action.payload }
        case USER_EDIT_PROFILE_FAIL:
            return { ...state, editUser: { loading: false, error: action.payload } }
        case USER_LOGGGED_OUT:
            return {}
        default:
            return state
    }
}
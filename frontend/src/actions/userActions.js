import {
    USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL,
    USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS,
    USER_LOGOUT, USER_LOGGGED_OUT,
    GOOGLE_LOGIN_REQUEST, GOOGLE_LOGIN_SUCCESS, GOOGLE_LOGIN_FAIL,
    USER_PROFILE_REQUEST, USER_PROFILE_SUCCESS, USER_PROFILE_FAIL,
    USER_UPLOAD_PICTURE_REQUEST, USER_UPLOAD_PICTURE_SUCCESS, USER_UPLOAD_PICTURE_FAIL,
    USER_EDIT_PROFILE_REQUEST, USER_EDIT_PROFILE_SUCCESS, USER_EDIT_PROFILE_FAIL
} from "../constants/userActionTypes"

const action = (type, payload = {}) => ({ type, payload })

export const registerRequest = user => (action(USER_REGISTER_REQUEST, user))
export const registerSuccess = user => (action(USER_REGISTER_SUCCESS, user))
export const registerFail = error => (action(USER_REGISTER_FAIL, error))

export const loginRequest = credentials => (action(USER_LOGIN_REQUEST, credentials))
export const loginSuccess = user => (action(USER_LOGIN_SUCCESS, user))
export const loginFail = error => (action(USER_LOGIN_FAIL, error))

export const logout = () => (action(USER_LOGOUT))
export const loggedOut = () => (action(USER_LOGGGED_OUT))

export const googleLoginRequest = (id_token) => action(GOOGLE_LOGIN_REQUEST, id_token)
export const googleLoginSuccess = (user) => action(GOOGLE_LOGIN_SUCCESS, user)
export const googleLoginFail = (error) => action(GOOGLE_LOGIN_FAIL, error)

export const getUserProfileRequest = () => action(USER_PROFILE_REQUEST)
export const getUserProfileSuccess = (user) => action(USER_PROFILE_SUCCESS, user)
export const getUserProfileFail = error => action(USER_PROFILE_FAIL, error)

export const uploadProfilePictureRequest = ({ formData }) => action(USER_UPLOAD_PICTURE_REQUEST, { formData })
export const uploadProfilePictureSuccess = picture => action(USER_UPLOAD_PICTURE_SUCCESS, picture)
export const uploadProfilePictureFail = error => action(USER_UPLOAD_PICTURE_FAIL, error)

export const editProfileRequest = user => action(USER_EDIT_PROFILE_REQUEST, user)
export const editProfileSuccess = user => action(USER_EDIT_PROFILE_SUCCESS, user)
export const editProfileFail = error => action(USER_EDIT_PROFILE_FAIL, error)
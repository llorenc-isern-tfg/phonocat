import userService from "../services/userService"
import {
    USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS,
    USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL
} from "../constants/userActionTypes"

export const login = (email, password) => async dispatch => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST })

        const { data } = await userService.login(email, password)

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.reponse.data.message ?
                error.response.data.message : error.message
        })
    }
}

export const register = (email, password, userName) => async dispatch => {
    try {
        dispatch({
            type: USER_REGISTER_REQUEST
        })

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data
        })

        //TODO: missatge confirmació?
        console.log('Usuari registrat:', data)
        const { data } = await userService.register(email, password)

    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.reponse.data.message ?
                error.response.data.message : error.message
        })
    }
}
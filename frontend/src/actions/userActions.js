import { loginService, registerService } from "../services/userServices"
import {
    USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS,
    USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL,
    USER_LOGOUT
} from "../constants/userActionTypes"
import { showAlert } from './alertActions'

import history from '../history'

export const login = (email, password) => async dispatch => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST })

        const { data } = await loginService(email, password)

        dispatch({ type: USER_LOGIN_SUCCESS, payload: data })
        dispatch(showAlert('success', { messageKey: 'session.welcome', params: { username: data.username } }))
        localStorage.setItem('userInfo', JSON.stringify(data))
        history.push('/app')

    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        dispatch({ type: USER_LOGIN_FAIL, payload: errorMsg })
        dispatch(showAlert('error', { messageKey: 'loginForm.fail' }))
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
        const { data } = await registerService(email, password)

    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.reponse.data.message ?
                error.response.data.message : error.message
        })
    }
}

export const logout = () => dispatch => {

    localStorage.removeItem('userInfo')
    dispatch({ type: USER_LOGOUT })
    //TODO: Aplicar resta de clear outs del local storage
    history.push('/app')
}
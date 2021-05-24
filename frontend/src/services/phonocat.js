import axios from 'axios'
import { store } from '../store'
import { onSessionExpired } from '../actions/userActions'

export const authToken = (userInfo) => {
    if (userInfo && userInfo.token) {
        return `Bearer ${userInfo.token}`
    }
    return ''
}

const api = axios.create({
    baseURL: '/api/'
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(error)
        if (error.response.status === 401) {
            console.log('SESSION EXPIRED')
            store.dispatch(onSessionExpired())
        }

        return Promise.reject(error);
    }
)

export { api }
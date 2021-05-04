import axios from 'axios'

export const authToken = (userInfo) => {
    if (userInfo && userInfo.token) {
        return `Bearer ${userInfo.token}`
    }
    return ''
}

export const api = axios.create({
    baseURL: '/api/'
})
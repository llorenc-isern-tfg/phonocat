import axios from 'axios'

const authHeader = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (userInfo && userInfo.token) {
        return `Bearer ${userInfo.token}`
    }
    return ''
}

export const getConfig = (needsAuth, contentType) => {
    const headers = {}
    if (needsAuth) {
        headers['Authorization'] = authHeader()
    }
    if (contentType) {
        headers['Content-Type'] = contentType
    }

    return { headers }
}

export const api = axios.create({
    baseURL: '/api/'
})
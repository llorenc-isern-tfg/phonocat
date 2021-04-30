import axios from 'axios'

export const authToken = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (userInfo && userInfo.token) {
        return `Bearer ${userInfo.token}`
    }
    return ''
}

export const api = axios.create({
    baseURL: '/api/'
})
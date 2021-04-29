import { api, getConfig } from './phonocat'

export const loginService = (email, password) => {
    return api.post('/users/login', { email, password }, getConfig(false, 'application/json'))
}

export const registerService = (username, email, password) => {
    return api.post('/users/register', { username, email, password }, getConfig(false, 'application/json'))
}
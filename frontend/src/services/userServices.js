import { api } from './phonocat'

export const loginService = credentials => {
    return api.post('/users/login', credentials, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const registerService = (username, email, password) => {
    return api.post('/users/register', { username, email, password }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
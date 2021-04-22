import { api, getConfig } from './appService'

const login = (email, password) => {
    return api.post('/users/login', { email, password }, getConfig(false, 'application/json'))
}

export default { login }
import { api, authToken } from './phonocat'

export const getUserListService = (userInfo, params) => {
    return api.get('users/', {
        params,
        headers: {
            'Authorization': authToken(userInfo),
        }
    })
}

export const getUserDetailService = (userInfo, username) => {
    return api.get(`users/${username}/`, {
        headers: {
            'Authorization': authToken(userInfo),
        }
    })
}
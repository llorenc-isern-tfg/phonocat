import { api, authToken } from './phonocat'

export const getUserListService = (userInfo, params) => {
    return api.get('users', {
        params,
        headers: {
            'Authorization': authToken(userInfo),
        }
    })
}

export const getUserDetailService = (userInfo, username) => {
    return api.get(`users/${username}`, {
        headers: {
            'Authorization': authToken(userInfo),
        }
    })
}

export const followUserService = (userInfo, username) => {
    return api.post(`users/${username}/follow`, {}, {
        headers: {
            'Authorization': authToken(userInfo),
            'Content-Type': 'application/json'
        }
    })
}

export const unfollowUserService = (userInfo, username) => {

    return api.delete(`users/${username}/unfollow`, {
        headers: {
            'Authorization': authToken(userInfo),
            'Content-Type': 'application/json'
        }
    })

}
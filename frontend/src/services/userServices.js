import { api, authToken } from './phonocat'

export const registerService = (user) => {
    return api.post('/users', user, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const loginService = credentials => {
    return api.post('/users/login', credentials, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const googleLoginService = (id_token) => {
    return api.post('/login/google', id_token, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const googleAuthService = () => {
    return api.get('http://localhost:5000/api/auth/google', {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const getUserProfileService = (userInfo) => {
    return api.get(`users/${userInfo.username}/profile`, {
        headers: {
            'Authorization': authToken(userInfo),
        }
    })
}

export const uploadProfilePictureService = (userInfo, formData) => {
    return api.post(`/users/${userInfo.username}/picture/`, formData,
        {
            headers: {
                'Authorization': authToken(userInfo),
                'Content-Type': 'multipart/form-data'
            }
        })
}

export const editUserProfileService = (userInfo, user) => {
    return api.patch(`/users/${userInfo.username}/profile`, user,
        {
            headers: {
                'Authorization': authToken(userInfo),
                'Content-Type': 'application/json'
            }
        })
}
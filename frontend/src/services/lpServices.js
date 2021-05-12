import { api, authToken } from './phonocat'

export const preloadAlbumDataService = (userInfo, { title, artist }) => {
    return api.get('album/search', {
        headers: {
            'Authorization': authToken(userInfo),
        },
        params: { title, artist }
    })
}

export const addLpService = (userInfo, lp) => {
    return api.post(`users/${userInfo.username}/lps`, lp,
        {
            headers: {
                'Authorization': authToken(userInfo),
                'Content-Type': 'application/json'
            }
        })
}

export const getLpCollectionService = (userInfo) => {
    return api.get(`users/${userInfo.username}/lps`, {
        headers: {
            'Authorization': authToken(userInfo),
        }
    })
}

export const deleteLpService = (userInfo, id) => {
    return api.delete(`users/${userInfo.username}/lps/${id}`,
        {
            headers: {
                'Authorization': authToken(userInfo),
            }
        })
}

export const uploadLpCover = (userInfo, id, formData) => {
    return api.post(`/lps/${id}/cover/`, formData,
        {
            headers: {
                'Authorization': authToken(userInfo),
                'Content-Type': 'multipart/form-data'
            }
        })
}

export const getLpDetailsService = (userInfo, id) => {
    return api.get(`users/${userInfo.username}/lps/${id}`, {
        headers: {
            'Authorization': authToken(userInfo),
        }
    })
}

export const editLpService = (userInfo, lp) => {
    return api.patch(`users/${userInfo.username}/lps/${lp._id}`, lp,
        {
            headers: {
                'Authorization': authToken(userInfo),
                'Content-Type': 'application/json'
            }
        })
}
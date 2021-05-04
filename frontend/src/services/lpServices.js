import { api, authToken } from './phonocat'

export const preloadAlbumDataService = (userInfo, { title, artist }) => {
    return api.get('album/search', {
        headers: {
            'Authorization': authToken(userInfo),
            'Content-Type': 'application/json'
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
            'Content-Type': 'application/json'
        }
    })
}
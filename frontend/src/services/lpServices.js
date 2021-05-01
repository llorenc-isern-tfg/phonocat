import { api, authToken } from './phonocat'

export const preloadAlbumDataService = (title, artist) => {
    return api.get('album/search', {
        headers: {
            'Authorization': authToken()
        },
        params: { title, artist }
    })
}

export const addLPService = (username, lp) => {
    return api.post(`users/${username}/lps`, lp,
        {
            headers: {
                'Authorization': authToken(),
                'Content-Type': 'application/json'
            }
        })
}
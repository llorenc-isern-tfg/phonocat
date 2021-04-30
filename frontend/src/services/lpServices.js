import { api, authToken } from './phonocat'

export const preloadAlbumDataService = (title, artist) => {
    return api.get('album/search', {
        headers: {
            'Authorization': authToken()
        },
        params: { title, artist }
    })
}
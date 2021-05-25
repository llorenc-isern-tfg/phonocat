import axios from 'axios'

export const searchAlbumsService = (albumTitle) => {
    return axios.get(process.env.REACT_APP_LASTFM_URL, {
        params: {
            api_key: process.env.REACT_APP_LASTFM_KEY,
            method: 'album.search',
            album: albumTitle,
            limit: 20,
            format: 'json'
        }
    })
}
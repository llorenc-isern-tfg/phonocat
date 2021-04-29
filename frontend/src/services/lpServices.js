import { api, getConfig } from './phonocat'

export const preloadAlbumDataService = (title, artist) => {
    return api.get('album/search', {
        headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwODg1NGNhOThkMDIwNTFjOGE4Y2ZjYSIsImlhdCI6MTYxOTY4NTQxMSwiZXhwIjoxNjE5NzcxODExfQ.rgtGu1ldVj3Fxse02QtLdkF9hXlVzV6yVkDsWR0ZUog`
        },
        params: {
            title,
            artist
        }
    })
}
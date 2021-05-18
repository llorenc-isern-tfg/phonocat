import { api, authToken } from './phonocat'

export const listLpForSaleService = (userInfo, lpId, formData) => {
    return api.post(`lps/${lpId}/listforsale`, formData,
        {
            headers: {
                'Authorization': authToken(userInfo),
                'Content-Type': 'multipart/form-data'
            }
        })
}

export const unlistLpForSaleService = (userInfo, id) => {
    return api.delete(`listedItems/${id}`,
        {
            headers: {
                'Authorization': authToken(userInfo),
            }
        })
}
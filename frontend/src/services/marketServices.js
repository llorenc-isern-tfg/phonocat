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
    return api.delete(`market/listedItems/${id}`,
        {
            headers: {
                'Authorization': authToken(userInfo),
            }
        })
}

export const getListedItemsService = (userInfo, params) => {
    return api.get('market/listedItems', {
        params,
        headers: {
            'Authorization': authToken(userInfo),
        }
    })
}

export const makeOfferService = (userInfo, listedItemId, offer) => {
    return api.post(`market/listedItems/${listedItemId}/offer`, offer,
        {
            headers: {
                'Authorization': authToken(userInfo),
                'Content-Type': 'application/json'
            }
        })
}

export const getReceivedOffersService = (userInfo) => {
    return api.get('market/offers/received', {
        headers: {
            'Authorization': authToken(userInfo),
        }
    })
}

export const getSendedOffersService = (userInfo) => {
    return api.get('market/offers/sended', {
        headers: {
            'Authorization': authToken(userInfo),
        }
    })
}

export const rejectOfferService = (userInfo, id) => {
    return api.patch(`market/offers/${id}/reject`, {}, {
        headers: {
            'Authorization': authToken(userInfo),
            'Content-Type': 'application/json'
        }
    })
}

export const acceptOfferService = (userInfo, id) => {
    return api.patch(`market/offers/${id}/accept`, {}, {
        headers: {
            'Authorization': authToken(userInfo),
            'Content-Type': 'application/json'
        }
    })
}

export const rateOfferService = (userInfo, id, score) => {
    return api.patch(`market/offers/${id}/rate`, { score }, {
        headers: {
            'Authorization': authToken(userInfo),
            'Content-Type': 'application/json'
        }
    })
}
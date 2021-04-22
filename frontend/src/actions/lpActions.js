import { LP_COLLECTION_REQUEST, LP_COLLECTION_SUCCESS, LP_COLLECTION_FAIL } from './lpActionTypes'

import phonocat from '../services/appService'

export const listUserAlbums = (userId) => async (dispatch) => {
    try {
        dispatch({ type: LP_COLLECTION_REQUEST })

        const { data } = await phonocat.get(`${userId}/albums`)

        dispatch({
            type: LP_COLLECTION_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: LP_COLLECTION_FAIL,
            payload: error.response && error.reponse.data.message ?
                error.response.data.message : error.message
        })
    }
}
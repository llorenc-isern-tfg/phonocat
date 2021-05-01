import { LP_ADD_REQUEST, LP_ADD_FAIL, LP_ADD_SUCCESS } from '../constants/lpActionTypes'

import { addLPService } from '../services/lpServices'
import { showAlert } from './alertActions'

// export const listUserAlbums = (userId) => async (dispatch) => {
//     try {
//         dispatch({ type: LP_COLLECTION_REQUEST })

//         const { data } = await phonocat.get(`${userId}/albums`)

//         dispatch({
//             type: LP_COLLECTION_SUCCESS,
//             payload: data
//         })

//     } catch (error) {
//         dispatch({
//             type: LP_COLLECTION_FAIL,
//             payload: error.response && error.reponse.data.message ?
//                 error.response.data.message : error.message
//         })
//     }
// }

export const addLP = (lp) => async (dispatch, getState) => {
    try {
        console.log('HOLA')
        console.log(getState())
        dispatch({ type: LP_ADD_REQUEST })

        const { username } = getState().auth.userInfo
        const { data } = await addLPService(username, lp)

        dispatch({
            type: LP_ADD_SUCCESS,
            payload: data
        })
        showAlert('success', { messageKey: 'addLP.success' })

    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        dispatch({ type: LP_ADD_FAIL, payload: errorMsg })
        dispatch(showAlert('error', { messageKey: 'addLP.fail' }))
    }
}
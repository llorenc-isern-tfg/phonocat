import {
    LP_COLLECTION_REQUEST, LP_COLLECTION_SUCCESS, LP_COLLECTION_FAIL,
    LP_ADD_REQUEST, LP_ADD_FAIL, LP_ADD_SUCCESS,
    LP_AUTOCOMPLETE_SEARCH_REQUEST, LP_AUTOCOMPLETE_SEARCH_FAIL, LP_AUTOCOMPLETE_SEARCH_SUCCESS, LP_AUTOCOMPLETE_SEARCH_CLEAR,
    LP_FETCH_EXTERNAL_DATA_REQUEST, LP_FETCH_EXTERNAL_DATA_FAIL, LP_FETCH_EXTERNAL_DATA_SUCCESS, LP_FETCH_EXTERNAL_DATA_CLEAR
} from '../constants/lpActionTypes'

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

const action = (type, payload = {}) => ({ type, payload })

export const lpCollectionRequest = () => (action(LP_COLLECTION_REQUEST))
export const lpCollectionSuccess = (lps) => (action(LP_COLLECTION_SUCCESS, lps))
export const lpCollectionFail = error => (action(LP_COLLECTION_FAIL, error))

export const lpAdd = lp => (action(LP_ADD_REQUEST, lp))
export const lpAddSuccess = lp => (action(LP_ADD_SUCCESS, lp))
export const lpAddFail = error => (action(LP_ADD_FAIL, error))

export const lpAutocompleteSearch = searchTerm => (action(LP_AUTOCOMPLETE_SEARCH_REQUEST, searchTerm))
export const lpAutocompleteSearchSuccess = ({ searchTerm, searchResults }) => (action(LP_AUTOCOMPLETE_SEARCH_SUCCESS, { searchTerm, searchResults }))
export const lpAutocompleteSearchFail = error => (action(LP_AUTOCOMPLETE_SEARCH_FAIL, error))
export const lpAutocompleteSearchClear = () => (action(LP_AUTOCOMPLETE_SEARCH_CLEAR))

export const lpPreloadExternalData = searchResult => (action(LP_FETCH_EXTERNAL_DATA_REQUEST, searchResult))
export const lpPreloadExternalDataSuccess = ({ searchResult, preloadedData }) => (action(LP_FETCH_EXTERNAL_DATA_SUCCESS, { searchResult, preloadedData }))
export const lpPreloadExternalDataFail = (error, searchResult) => (action(LP_FETCH_EXTERNAL_DATA_FAIL, { error, searchResult }))
export const lpPreloadExternalDataClear = () => (action(LP_FETCH_EXTERNAL_DATA_CLEAR))

// export const addLP = (lp) => async (dispatch, getState) => {
//     try {
//         // console.log('HOLA')
//         // console.log(getState())
//         dispatch({ type: LP_ADD_REQUEST })

//         const { username } = getState().auth.userInfo
//         const { data } = await addLPService(username, lp)

//         dispatch({
//             type: LP_ADD_SUCCESS,
//             payload: data
//         })
//         showAlert('success', { messageKey: 'addLP.success' })

//     } catch (error) {
//         const errorMsg = error.response && error.response.data.message ?
//             error.response.data.message : error.message
//         dispatch({ type: LP_ADD_FAIL, payload: errorMsg })
//         dispatch(showAlert('error', { messageKey: 'addLP.fail' }))
//     }
// }
import {
    LP_COLLECTION_REQUEST, LP_COLLECTION_SUCCESS, LP_COLLECTION_FAIL,
    LP_ADD_REQUEST, LP_ADD_FAIL, LP_ADD_SUCCESS,
    LP_AUTOCOMPLETE_SEARCH_REQUEST, LP_AUTOCOMPLETE_SEARCH_FAIL, LP_AUTOCOMPLETE_SEARCH_SUCCESS, LP_AUTOCOMPLETE_SEARCH_CLEAR,
    LP_FETCH_EXTERNAL_DATA_REQUEST, LP_FETCH_EXTERNAL_DATA_FAIL, LP_FETCH_EXTERNAL_DATA_SUCCESS, LP_FETCH_EXTERNAL_DATA_CLEAR,
    LP_DELETE_REQUEST, LP_DELETE_FAIL, LP_DELETE_SUCCESS,
} from '../constants/lpActionTypes'

const action = (type, payload = {}) => ({ type, payload })

export const lpCollectionRequest = () => action(LP_COLLECTION_REQUEST)
export const lpCollectionSuccess = (lps) => action(LP_COLLECTION_SUCCESS, lps)
export const lpCollectionFail = error => action(LP_COLLECTION_FAIL, error)

export const lpAdd = lp => action(LP_ADD_REQUEST, lp)
export const lpAddSuccess = lp => action(LP_ADD_SUCCESS, lp)
export const lpAddFail = error => action(LP_ADD_FAIL, error)

export const lpAutocompleteSearch = searchTerm => action(LP_AUTOCOMPLETE_SEARCH_REQUEST, searchTerm)
export const lpAutocompleteSearchSuccess = ({ searchTerm, searchResults }) => action(LP_AUTOCOMPLETE_SEARCH_SUCCESS, { searchTerm, searchResults })
export const lpAutocompleteSearchFail = error => action(LP_AUTOCOMPLETE_SEARCH_FAIL, error)
export const lpAutocompleteSearchClear = () => action(LP_AUTOCOMPLETE_SEARCH_CLEAR)

export const lpPreloadExternalData = searchResult => action(LP_FETCH_EXTERNAL_DATA_REQUEST, searchResult)
export const lpPreloadExternalDataSuccess = ({ searchResult, preloadedData }) => action(LP_FETCH_EXTERNAL_DATA_SUCCESS, { searchResult, preloadedData })
export const lpPreloadExternalDataFail = (error, searchResult) => action(LP_FETCH_EXTERNAL_DATA_FAIL, { error, searchResult })
export const lpPreloadExternalDataClear = () => action(LP_FETCH_EXTERNAL_DATA_CLEAR)

export const lpDeleteRequest = id => action(LP_DELETE_REQUEST, id)
export const lpDeleteSuccess = id => action(LP_DELETE_SUCCESS, id)
export const lpDeleteFail = error => action(LP_DELETE_FAIL, error)
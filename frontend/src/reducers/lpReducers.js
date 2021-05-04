import {
    LP_COLLECTION_REQUEST, LP_COLLECTION_SUCCESS, LP_COLLECTION_FAIL,
    LP_ADD_REQUEST, LP_ADD_FAIL, LP_ADD_SUCCESS,
    LP_AUTOCOMPLETE_SEARCH_REQUEST, LP_AUTOCOMPLETE_SEARCH_FAIL, LP_AUTOCOMPLETE_SEARCH_SUCCESS, LP_AUTOCOMPLETE_SEARCH_CLEAR,
    LP_FETCH_EXTERNAL_DATA_REQUEST, LP_FETCH_EXTERNAL_DATA_FAIL, LP_FETCH_EXTERNAL_DATA_SUCCESS, LP_FETCH_EXTERNAL_DATA_CLEAR
} from '../constants/lpActionTypes'

export const lpCollectionReducer = (state = {}, action) => {
    switch (action.type) {
        case LP_COLLECTION_REQUEST:
            return { ...state, loading: true, lps: [] }
        case LP_COLLECTION_SUCCESS:
            return { ...state, loading: false, lps: action.payload }
        case LP_COLLECTION_FAIL:
            return { ...state, loading: false, error: action.payload }
        default:
            return state
    }
}

export const lpAddReducer = (state = {}, action) => {
    switch (action.type) {
        case LP_ADD_REQUEST:
            return { ...state, loading: true, lp: action.payload }
        case LP_ADD_SUCCESS:
            return { ...state, loading: false, lp: action.payload }
        case LP_ADD_FAIL:
            return { ...state, loading: false, error: action.payload }
        default:
            return state
    }
}

export const lpAutocompleteReducer = (state = {}, action) => {
    switch (action.type) {
        case LP_AUTOCOMPLETE_SEARCH_REQUEST:
            return { ...state, loading: true, searchTerm: action.payload.searchTerm }
        case LP_AUTOCOMPLETE_SEARCH_SUCCESS:
            return { ...state, loading: false, searchTerm: action.payload.searchTerm, searchResults: action.payload.searchResults }
        case LP_AUTOCOMPLETE_SEARCH_FAIL:
            return { ...state, loading: false, error: action.payload }
        case LP_AUTOCOMPLETE_SEARCH_CLEAR:
            return { ...state, loading: false, searchResults: [] }
        default:
            return state
    }
}

export const lpPreloadReducer = (state = {}, action) => {
    switch (action.type) {
        case LP_FETCH_EXTERNAL_DATA_REQUEST:
            return { status: { finished: false, type: 'request' }, searchResult: action.payload.searchResult }
        case LP_FETCH_EXTERNAL_DATA_SUCCESS:
            return { status: { finished: true, type: 'success' }, searchResult: action.payload.searchResult, preloadedData: action.payload.preloadedData }
        case LP_FETCH_EXTERNAL_DATA_FAIL:
            return { status: { finished: true, type: 'fail' }, error: action.payload.error, searchResult: action.payload.searchResult, preloadedData: {} }
        case LP_FETCH_EXTERNAL_DATA_CLEAR:
            return {}
        default:
            return state
    }
}
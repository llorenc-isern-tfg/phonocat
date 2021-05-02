import {
    LP_COLLECTION_REQUEST, LP_COLLECTION_SUCCESS, LP_COLLECTION_FAIL,
    LP_AUTOCOMPLETE_SEARCH_REQUEST, LP_AUTOCOMPLETE_SEARCH_FAIL, LP_AUTOCOMPLETE_SEARCH_SUCCESS, LP_AUTOCOMPLETE_SEARCH_CLEAR
} from '../constants/lpActionTypes'

export const lpCollectionReducer = (state = {}, action) => {
    switch (action.type) {
        case LP_COLLECTION_REQUEST:
            return { loading: true, albums: [] }
        case LP_COLLECTION_SUCCESS:
            return { loading: false, albums: action.payload }
        case LP_COLLECTION_FAIL:
            return { loading: false, error: action.payload }
    }
}

export const lpAutocompleteReducer = (state = {}, action) => {
    switch (action.type) {
        case LP_AUTOCOMPLETE_SEARCH_REQUEST:
            return { loading: true, searchTerm: action.payload.searchTerm }
        case LP_AUTOCOMPLETE_SEARCH_SUCCESS:
            return { loading: false, searchTerm: action.payload.searchTerm, searchResults: action.payload.searchResults }
        case LP_AUTOCOMPLETE_SEARCH_FAIL:
            return { loading: false, error: action.payload }
        case LP_AUTOCOMPLETE_SEARCH_CLEAR:
            return { loading: false, searchResults: [] }
        default:
            return state
    }
}
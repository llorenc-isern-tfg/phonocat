import {
    LP_COLLECTION_REQUEST, LP_COLLECTION_SUCCESS, LP_COLLECTION_FAIL,
    LP_ADD_REQUEST, LP_ADD_FAIL, LP_ADD_SUCCESS,
    LP_AUTOCOMPLETE_SEARCH_REQUEST, LP_AUTOCOMPLETE_SEARCH_FAIL, LP_AUTOCOMPLETE_SEARCH_SUCCESS, LP_AUTOCOMPLETE_SEARCH_CLEAR,
    LP_FETCH_EXTERNAL_DATA_REQUEST, LP_FETCH_EXTERNAL_DATA_FAIL, LP_FETCH_EXTERNAL_DATA_SUCCESS, LP_FETCH_EXTERNAL_DATA_CLEAR,
    LP_DELETE_REQUEST, LP_DELETE_FAIL, LP_DELETE_SUCCESS,
    LP_ADD_COVER_REQUEST, LP_ADD_COVER_SUCCESS, LP_ADD_COVER_FAIL,
    LP_DETAILS_REQUEST, LP_DETAILS_SUCCESS, LP_DETAILS_FAIL, LP_DETAILS_CLEAR,
    LP_EDIT_COVER_REQUEST, LP_EDIT_COVER_SUCCESS, LP_EDIT_COVER_FAIL,
    LP_EDIT_REQUEST, LP_EDIT_FAIL, LP_EDIT_SUCCESS,
} from '../constants/lpActionTypes'

export const lpCollectionReducer = (state = {}, action) => {
    switch (action.type) {
        case LP_COLLECTION_REQUEST:
            return { ...state, loading: true }
        case LP_COLLECTION_SUCCESS:
            return { ...state, loading: false, lps: action.payload }
        case LP_COLLECTION_FAIL:
            return { ...state, loading: false, error: action.payload }
        case LP_DELETE_REQUEST:
            return { ...state, loading: true }
        case LP_DELETE_SUCCESS:
            return { ...state, loading: false, lps: state.lps.filter(lp => lp._id !== action.payload) }
        case LP_DELETE_FAIL:
            return { ...state, loading: false }
        default:
            return state
    }
}

const lpAddInitialState = {
    status: {},
    autocomplete: {},
    preload: {},
    add: {}
}
export const lpAddReducer = (state = lpAddInitialState, action) => {
    switch (action.type) {
        //autocomplete search step
        case LP_AUTOCOMPLETE_SEARCH_REQUEST:
            return { ...state, autocomplete: { loading: true, searchTerm: action.payload.searchTerm } }
        case LP_AUTOCOMPLETE_SEARCH_SUCCESS:
            return { ...state, autocomplete: { loading: false, searchTerm: action.payload.searchTerm, searchResults: action.payload.searchResults } }
        case LP_AUTOCOMPLETE_SEARCH_FAIL:
            return { ...state, autocomplete: { loading: false, error: action.payload } }
        case LP_AUTOCOMPLETE_SEARCH_CLEAR:
            return { ...state, autocomplete: {} }
        //detail form preload
        case LP_FETCH_EXTERNAL_DATA_REQUEST:
            return { ...state, status: { loading: true, type: action.type }, preload: { searchResult: action.payload.searchResult } }
        case LP_FETCH_EXTERNAL_DATA_SUCCESS:
            return { ...state, status: { loading: false, type: action.type, moveStep: true }, preload: { searchResult: action.payload.searchResult, preloadedData: action.payload.preloadedData } }
        case LP_FETCH_EXTERNAL_DATA_FAIL:
            return { ...state, status: { loading: false, type: action.type, moveStep: true }, preload: { searchResult: action.payload.searchResult, error: action.payload.error } }
        case LP_FETCH_EXTERNAL_DATA_CLEAR:
            return { ...state, status: {}, preload: {} }
        //detail form submit
        case LP_ADD_REQUEST:
            return { ...state, status: { loading: true, type: action.type }, add: { lp: action.payload } }
        case LP_ADD_SUCCESS:
            return { ...state, status: { loading: false, type: action.type, moveStep: true }, add: { lp: action.payload } }
        case LP_ADD_FAIL:
            return { ...state, status: { loading: false, type: action.type }, add: { error: action.payload } }
        //cover
        case LP_ADD_COVER_REQUEST:
            return { ...state, status: { loading: true, type: action.type }, cover: { formData: action.payload } }
        case LP_ADD_COVER_SUCCESS:
            return { ...state, status: { loading: false, type: action.type, moveStep: true }, cover: action.payload }
        case LP_ADD_COVER_FAIL:
            return { ...state, status: { loading: false, type: action.type }, cover: { error: action.payload } }
        default:
            return state
    }
}

export const lpDetailsReducer = (state = {}, action) => {
    switch (action.type) {
        case LP_DETAILS_REQUEST:
            return { ...state, status: { loading: true, type: action.type }, id: action.payload }
        case LP_DETAILS_SUCCESS:
            return { ...state, status: { loading: false, type: action.type }, lp: action.payload }
        case LP_DETAILS_FAIL:
            return { ...state, status: { loading: false, type: action.type }, error: action.payload }
        case LP_DETAILS_CLEAR:
            return {}
        default:
            return state
    }
}

export const lpEditReducer = (state = {}, action) => {
    switch (action.type) {
        //edit cover
        case LP_EDIT_COVER_REQUEST:
            return { ...state, editCover: { loading: true, formData: action.payload } }
        case LP_EDIT_COVER_SUCCESS:
            return { ...state, editCover: { loading: false, uploadCover: action.payload } }
        case LP_EDIT_COVER_FAIL:
            return { ...state, editCover: { loading: false, error: action.payload } }
        //edit data
        case LP_EDIT_REQUEST:
            return { ...state, status: { loading: true, type: action.type }, lp: action.payload }
        case LP_EDIT_SUCCESS:
            return { ...state, status: { loading: false, type: action.type }, lp: action.payload }
        case LP_EDIT_FAIL:
            return { ...state, status: { loading: false, type: action.type }, errpr: action.payload }
        default:
            return state
    }
}
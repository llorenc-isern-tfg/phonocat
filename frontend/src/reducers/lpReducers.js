import { LP_COLLECTION_REQUEST, LP_COLLECTION_SUCCESS, LP_COLLECTION_FAIL } from '../constants/lpActionTypes'

export const lpCollectionReducer = (state = {}, action) => {
    switch (action.type) {
        case LP_COLLECTION_REQUEST:
            return { loading: true, albums: [] }
        case LP_COLLECTION_SUCCESS:
            return { loading: false, albums: action.payload }
        case LP_COLLECTION_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}
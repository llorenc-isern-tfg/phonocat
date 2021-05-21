import _ from 'lodash'

import {
    LISTED_ITEMS_REQUEST, LISTED_ITEMS_SUCCESS, LISTED_ITEMS_FAIL, LISTED_ITEMS_CLEAR
} from '../constants/marketActionTypes'

const listedItemsInitialState = {
    listedItems: []
}

export const listedItemsReducer = (state = listedItemsInitialState, action) => {
    switch (action.type) {
        case LISTED_ITEMS_REQUEST:
            return { ...state, loading: true }
        case LISTED_ITEMS_SUCCESS:
            return {
                ...state, loading: false,
                listedItems: action.payload.listedItems,
                pagination: action.payload.pagination,
                filterHelper: action.payload.filterHelper
            }
        case LISTED_ITEMS_FAIL:
            return { ...state, loading: false, error: action.payload }
        case LISTED_ITEMS_CLEAR:
            return { listedItems: [] }
        default:
            return state
    }
}
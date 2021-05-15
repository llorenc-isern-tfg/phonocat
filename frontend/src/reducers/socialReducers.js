import _ from 'lodash'
import {
    USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_LIST_FAIL, USER_LIST_CLEAR,
    USER_DETAIL_REQUEST, USER_DETAIL_SUCCESS, USER_DETAIL_FAIL,
} from '../constants/socialActionTypes'

const userListInitialState = {
    users: []
}

export const userListReducer = (state = userListInitialState, action) => {
    switch (action.type) {
        case USER_LIST_REQUEST:
            return { ...state, loading: true }
        case USER_LIST_SUCCESS:
            return {
                ...state, loading: false,
                users: _.concat(...state.users, action.payload.users), pagination: action.payload.pagination
            }
        case USER_LIST_FAIL:
            return { ...state, loading: false, error: action.payload }
        case USER_LIST_CLEAR:
            return { users: [] }
        default:
            return state
    }
}

export const userDetailReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_DETAIL_REQUEST:
            return { ...state, status: { loading: true, type: action.type } }
        case USER_DETAIL_SUCCESS:
            return { ...state, status: { loading: false, type: action.type }, user: action.payload }
        case USER_DETAIL_FAIL:
            return { ...state, status: { loading: false, type: action.type }, error: action.payload }
        default:
            return state
    }
}

import _ from 'lodash'

import {
    USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_LIST_FAIL, USER_LIST_CLEAR,
    USER_DETAIL_REQUEST, USER_DETAIL_SUCCESS, USER_DETAIL_FAIL,
    USER_FOLLOW_REQUEST, USER_FOLLOW_SUCCESS, USER_FOLLOW_FAIL,
    USER_UNFOLLOW_REQUEST, USER_UNFOLLOW_SUCCESS, USER_UNFOLLOW_FAIL,
    USER_DETAIL_CLEAR
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
    let followers
    switch (action.type) {
        case USER_DETAIL_REQUEST:
            return { ...state, status: { loading: true } }
        case USER_DETAIL_SUCCESS:
            return { ...state, status: { loading: false }, user: action.payload }
        case USER_DETAIL_FAIL:
            return { ...state, status: { loading: false }, error: action.payload }
        case USER_FOLLOW_REQUEST:
        case USER_UNFOLLOW_REQUEST:
            return { ...state, followingStatus: { loading: true } }
        case USER_FOLLOW_SUCCESS:
            //Afegim l'usuari al llistat de seguidors si no hi era
            const { username, picture } = action.payload
            followers = [...state.user.followers]
            if (!followers.find(follower => follower.username === username)) {
                followers.unshift({ username, picture })
            }
            return {
                ...state, followingStatus: { loading: false, following: true },
                user: { ...state.user, followers }
            }
        case USER_UNFOLLOW_SUCCESS:
            //Esborrem l'usuari del llistat de seguidors
            followers = [...state.user.followers].filter(follower => follower.username !== action.payload)
            return {
                ...state, followingStatus: { loading: false, following: false },
                user: { ...state.user, followers }
            }
        case USER_FOLLOW_FAIL:
        case USER_UNFOLLOW_FAIL:
            return { ...state, followingStatus: { ...state.followingStatus, loading: false } }
        case USER_DETAIL_CLEAR:
            return {}
        default:
            return state
    }
}

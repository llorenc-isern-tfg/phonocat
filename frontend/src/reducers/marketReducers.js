import {
    LISTED_ITEMS_REQUEST, LISTED_ITEMS_SUCCESS, LISTED_ITEMS_FAIL, LISTED_ITEMS_CLEAR,
    MAKE_OFFER_REQUEST, MAKE_OFFER_SUCCESS, MAKE_OFFER_FAIL,
    LOAD_RECEIVED_OFFERS_REQUEST, LOAD_RECEIVED_OFFERS_SUCCESS, LOAD_RECEIVED_OFFERS_FAIL, LOAD_RECEIVED_OFFERS_CLEAR,
    LOAD_SENDED_OFFERS_REQUEST, LOAD_SENDED_OFFERS_SUCCESS, LOAD_SENDED_OFFERS_FAIL, LOAD_SENDED_OFFERS_CLEAR,
    REJECT_OFFER_REQUEST, REJECT_OFFER_SUCCESS, REJECT_OFFER_FAIL,
    ACCEPT_OFFER_REQUEST, ACCEPT_OFFER_SUCCESS, ACCEPT_OFFER_FAIL,
    RATE_OFFER_REQUEST, RATE_OFFER_SUCCESS, RATE_OFFER_FAIL
} from '../constants/marketActionTypes'

import { USER_LOGGGED_OUT } from '../constants/userActionTypes'

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
        case MAKE_OFFER_SUCCESS:
            //Afegim la nova oferta a l'item
            const { offer } = action.payload
            let listedItems = [...state.listedItems]
            let item = listedItems.find(listedItem => listedItem._id === offer.listedItem)
            if (!item.offers.find(of => of._id === offer._id)) {
                item.offers.unshift(offer)
            }
            return {
                ...state, listedItems: listedItems
            }
        case USER_LOGGGED_OUT:
            return listedItemsInitialState
        default:
            return state
    }
}

export const listedItemOfferReducer = (state = {}, action) => {
    switch (action.type) {
        case MAKE_OFFER_REQUEST:
            return { ...state, loading: true }
        case MAKE_OFFER_SUCCESS:
            return {
                ...state, loading: false,
                offer: action.payload.offer
            }
        case MAKE_OFFER_FAIL:
            return { ...state, loading: false, error: action.payload }
        case USER_LOGGGED_OUT:
            return {}
        default:
            return state
    }
}

const receivedOffersInitialState = {
    groupedOffers: []
}
export const receivedOffersReducer = (state = receivedOffersInitialState, action) => {
    let offer
    let groupedOffers
    let newStateGroupedOffers
    let error
    let userType
    switch (action.type) {
        case LOAD_RECEIVED_OFFERS_REQUEST:
            return { ...state, loading: true }
        case LOAD_RECEIVED_OFFERS_SUCCESS:
            return {
                ...state, loading: false,
                groupedOffers: action.payload,
            }
        case LOAD_RECEIVED_OFFERS_FAIL:
            return { ...state, loading: false, error: action.payload }
        case LOAD_RECEIVED_OFFERS_CLEAR:
            return { groupedOffers: [] }
        case REJECT_OFFER_REQUEST:
            //Deshabilitem totes les ofertes de l'item mentre es processa la petició
            offer = action.payload.offer
            groupedOffers = [...state.groupedOffers]
            newStateGroupedOffers = groupedOffers.map((groupedOffer) => {
                if (groupedOffer.listedItem._id === offer.listedItemId) {
                    groupedOffer.offers.forEach(off => {
                        off.disabled = true
                        if (off._id === offer._id)
                            off.rejecting = true
                    })
                }
                return groupedOffer
            })
            return {
                ...state, groupedOffers: newStateGroupedOffers
            }
        case REJECT_OFFER_SUCCESS:
            //Actualitzem l'estat de la oferta en questió a rebutjada
            offer = action.payload.offer
            groupedOffers = [...state.groupedOffers]
            newStateGroupedOffers = groupedOffers.map((groupedOffer) => {
                if (groupedOffer.listedItem._id === offer.listedItem) {
                    groupedOffer.offers.forEach(off => {
                        delete off['disabled']
                        if (off._id === offer._id) {
                            off.status = 'rejected'
                            delete off['rejecting']
                        }
                    })
                }
                return groupedOffer
            })
            return {
                ...state, groupedOffers: newStateGroupedOffers
            }

        case REJECT_OFFER_FAIL:
            //Tornem a habilitar les ofertes de l'item i desem l'error a l'estat
            offer = action.payload.offer
            error = action.payload.error
            groupedOffers = [...state.groupedOffers]
            newStateGroupedOffers = groupedOffers.map((groupedOffer) => {
                if (groupedOffer.listedItem._id === offer.listedItemId) {
                    groupedOffer.offers.forEach(off => {
                        delete off['disabled']
                        if (off._id === offer._id) {
                            delete off['rejecting']
                        }
                    })
                }
                return groupedOffer
            })
            return {
                ...state, groupedOffers: newStateGroupedOffers, error
            }

        case ACCEPT_OFFER_REQUEST:
            //Deshabilitem totes les ofertes de l'item mentre es processa la petició
            offer = action.payload.offer
            groupedOffers = [...state.groupedOffers]
            newStateGroupedOffers = groupedOffers.map((groupedOffer) => {
                if (groupedOffer.listedItem._id === offer.listedItemId) {
                    groupedOffer.offers.forEach(off => {
                        off.disabled = true
                        if (off._id === offer._id)
                            off.accepting = true
                    })
                }
                return groupedOffer
            })
            return {
                ...state, groupedOffers: newStateGroupedOffers
            }
        case ACCEPT_OFFER_SUCCESS:
            //Actualitzem l'estat de la oferta en questió a rebutjada
            offer = action.payload.offer
            groupedOffers = [...state.groupedOffers]
            newStateGroupedOffers = groupedOffers.map((groupedOffer) => {
                if (groupedOffer.listedItem._id === offer.listedItem._id) {
                    groupedOffer.offers.forEach(off => {
                        delete off['disabled']
                        if (off._id === offer._id) {
                            off.status = 'accepted'
                            delete off['accepting']
                        } else if (off.status === 'pending') {
                            off.status = 'rejected'
                        }
                    })
                }
                return groupedOffer
            })
            return {
                ...state, groupedOffers: newStateGroupedOffers
            }

        case ACCEPT_OFFER_FAIL:
            //Tornem a habilitar les ofertes de l'item i desem l'error a l'estat
            offer = action.payload.offer
            error = action.payload.error
            groupedOffers = [...state.groupedOffers]
            newStateGroupedOffers = groupedOffers.map((groupedOffer) => {
                if (groupedOffer.listedItem._id === offer.listedItemId) {
                    groupedOffer.offers.forEach(off => {
                        delete off['disabled']
                        if (off._id === offer._id) {
                            delete off['accepting']
                        }
                    })
                }
                return groupedOffer
            })
            return {
                ...state, groupedOffers: newStateGroupedOffers, error
            }

        case RATE_OFFER_REQUEST:
            userType = action.payload.userType
            if (userType === 'seller') {
                //Deshabilitem totes les ofertes de l'item mentre es processa la petició
                offer = action.payload.offer
                groupedOffers = [...state.groupedOffers]
                newStateGroupedOffers = groupedOffers.map((groupedOffer) => {
                    if (groupedOffer.listedItem._id === offer.listedItemId) {
                        groupedOffer.offers.forEach(off => {
                            if (off._id === offer._id)
                                off.rating = true
                        })
                    }
                    return groupedOffer
                })
                return {
                    ...state, groupedOffers: newStateGroupedOffers
                }
            }
            return state
        case RATE_OFFER_SUCCESS:
            userType = action.payload.userType
            if (userType === 'seller') {
                //Actualitzem l'estat de la oferta en questió amb la puntuacio del venedor
                offer = action.payload.resp.offer
                groupedOffers = [...state.groupedOffers]
                newStateGroupedOffers = groupedOffers.map((groupedOffer) => {
                    if (groupedOffer.listedItem._id === offer.listedItem) {
                        groupedOffer.offers.forEach(off => {
                            if (off._id === offer._id) {
                                off.sellerReview = offer.sellerReview
                                delete off['rating']
                            }
                        })
                    }
                    return groupedOffer
                })

                return {
                    ...state, groupedOffers: newStateGroupedOffers
                }
            }
            return state

        case RATE_OFFER_FAIL:
            userType = action.payload.userType
            if (userType === 'seller') {
                //Tornem a habilitar les ofertes de l'item i desem l'error a l'estat
                offer = action.payload.offer
                error = action.payload.error
                groupedOffers = [...state.groupedOffers]
                newStateGroupedOffers = groupedOffers.map((groupedOffer) => {
                    if (groupedOffer.listedItem._id === offer.listedItemId) {
                        groupedOffer.offers.forEach(off => {
                            if (off._id === offer._id) {
                                delete off['rating']
                            }
                        })
                    }
                    return groupedOffer
                })
                return {
                    ...state, groupedOffers: newStateGroupedOffers, error
                }
            }
            return state
        case USER_LOGGGED_OUT:
            return receivedOffersInitialState
        default:
            return state
    }
}

const sendedOffersInitialState = {
    sendedOffers: []
}
export const sendedOffersReducer = (state = sendedOffersInitialState, action) => {
    let offer
    let newStateOffers
    let error
    let userType
    switch (action.type) {
        case LOAD_SENDED_OFFERS_REQUEST:
            return { ...state, loadingSended: true }
        case LOAD_SENDED_OFFERS_SUCCESS:
            return {
                ...state, loadingSended: false,
                sendedOffers: action.payload,
            }
        case LOAD_SENDED_OFFERS_FAIL:
            return { ...state, loadingSended: false, error: action.payload }
        case LOAD_SENDED_OFFERS_CLEAR:
            return { sendedOffers: [] }

        case RATE_OFFER_REQUEST:
            userType = action.payload.userType
            if (userType === 'buyer') {
                //Deshabilitem totes les ofertes de l'item mentre es processa la petició
                offer = action.payload.offer
                newStateOffers = [...state.sendedOffers]

                newStateOffers.forEach(off => {
                    if (off._id === offer._id)
                        off.rating = true
                })

                return {
                    ...state, sendedOffers: newStateOffers
                }
            }
            return state
        case RATE_OFFER_SUCCESS:
            userType = action.payload.userType
            if (userType === 'buyer') {
                offer = action.payload.resp.offer
                newStateOffers = [...state.sendedOffers]

                newStateOffers.forEach(off => {
                    if (off._id === offer._id) {
                        off.buyerReview = offer.buyerReview
                        delete off['rating']
                    }
                })
                return {
                    ...state, sendedOffers: newStateOffers
                }
            }
            return state
        case RATE_OFFER_FAIL:
            userType = action.payload.userType
            error = action.payload.error
            if (userType === 'buyer') {
                //Tornem a habilitar les ofertes de l'item i desem l'error a l'estat
                offer = action.payload.offer
                newStateOffers = [...state.sendedOffers]
                newStateOffers.forEach(off => {
                    if (off._id === offer._id) {
                        delete off['rating']
                    }
                })

                return {
                    ...state, sendedOffers: newStateOffers, error: error
                }
            }
            return { ...state, error: error }
        case USER_LOGGGED_OUT:
            return sendedOffersInitialState
        default:
            return state
    }
}
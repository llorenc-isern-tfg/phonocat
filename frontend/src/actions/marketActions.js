import {
    LIST_LP_FORSALE_REQUEST, LIST_LP_FORSALE_SUCCESS, LIST_LP_FORSALE_FAIL,
    UNLIST_LP_FORSALE_REQUEST, UNLIST_LP_FORSALE_SUCCESS, UNLIST_LP_FORSALE_FAIL,
    LISTED_ITEMS_REQUEST, LISTED_ITEMS_SUCCESS, LISTED_ITEMS_FAIL, LISTED_ITEMS_CLEAR,
    MAKE_OFFER_REQUEST, MAKE_OFFER_SUCCESS, MAKE_OFFER_FAIL,
    LOAD_RECEIVED_OFFERS_REQUEST, LOAD_RECEIVED_OFFERS_SUCCESS, LOAD_RECEIVED_OFFERS_FAIL, LOAD_RECEIVED_OFFERS_CLEAR,
    LOAD_SENDED_OFFERS_REQUEST, LOAD_SENDED_OFFERS_SUCCESS, LOAD_SENDED_OFFERS_FAIL, LOAD_SENDED_OFFERS_CLEAR,
    REJECT_OFFER_REQUEST, REJECT_OFFER_SUCCESS, REJECT_OFFER_FAIL,
    ACCEPT_OFFER_REQUEST, ACCEPT_OFFER_SUCCESS, ACCEPT_OFFER_FAIL,
    RATE_OFFER_REQUEST, RATE_OFFER_SUCCESS, RATE_OFFER_FAIL
} from '../constants/marketActionTypes'

const action = (type, payload = {}) => ({ type, payload })

export const listLpForSaleRequest = listedItem => action(LIST_LP_FORSALE_REQUEST, listedItem)
export const listLpForSaleSuccess = listedItem => action(LIST_LP_FORSALE_SUCCESS, listedItem)
export const listLpForSaleFail = error => action(LIST_LP_FORSALE_FAIL, error)

export const unlistLpForSaleRequest = id => action(UNLIST_LP_FORSALE_REQUEST, id)
export const unlistLpForSaleSuccess = resp => action(UNLIST_LP_FORSALE_SUCCESS, resp)
export const unlistLpForSaleFail = error => action(UNLIST_LP_FORSALE_FAIL, error)

export const getListedItemsRequest = params => action(LISTED_ITEMS_REQUEST, params)
export const getListedItemsSuccess = listedItems => action(LISTED_ITEMS_SUCCESS, listedItems)
export const getListedItemsFail = error => action(LISTED_ITEMS_FAIL, error)
export const getListedItemsClear = () => action(LISTED_ITEMS_CLEAR)

export const makeOfferRequest = (listedItemId, offer) => action(MAKE_OFFER_REQUEST, { listedItemId, offer })
export const makeOfferSuccess = resp => action(MAKE_OFFER_SUCCESS, resp)
export const makeOfferFail = error => action(MAKE_OFFER_FAIL, error)

export const getReceivedOffersRequest = () => action(LOAD_RECEIVED_OFFERS_REQUEST)
export const getReceivedOffersSuccess = groupedOffers => action(LOAD_RECEIVED_OFFERS_SUCCESS, groupedOffers)
export const getReceivedOffersFail = error => action(LOAD_RECEIVED_OFFERS_FAIL, error)
export const getReceivedOffersClear = () => action(LOAD_RECEIVED_OFFERS_CLEAR)

export const getSendedOffersRequest = () => action(LOAD_SENDED_OFFERS_REQUEST)
export const getSendedOffersSuccess = offers => action(LOAD_SENDED_OFFERS_SUCCESS, offers)
export const getSendedOffersFail = error => action(LOAD_SENDED_OFFERS_FAIL, error)
export const getSendedOffersClear = () => action(LOAD_SENDED_OFFERS_CLEAR)

export const rejectOfferRequest = offer => action(REJECT_OFFER_REQUEST, { offer })
export const rejectOfferSuccess = resp => action(REJECT_OFFER_SUCCESS, resp)
export const rejectOfferFail = errorResp => action(REJECT_OFFER_FAIL, errorResp)

export const acceptOfferRequest = offer => action(ACCEPT_OFFER_REQUEST, { offer })
export const acceptOfferSuccess = resp => action(ACCEPT_OFFER_SUCCESS, resp)
export const acceptOfferFail = errorResp => action(ACCEPT_OFFER_FAIL, errorResp)

export const rateOfferRequest = (offer, score, userType) => action(RATE_OFFER_REQUEST, { offer, score, userType })
export const rateOfferSuccess = (resp, userType) => action(RATE_OFFER_SUCCESS, { resp, userType })
export const rateOfferFail = errorResp => action(RATE_OFFER_FAIL, errorResp)
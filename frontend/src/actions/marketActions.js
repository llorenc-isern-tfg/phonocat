import {
    LIST_LP_FORSALE_REQUEST, LIST_LP_FORSALE_SUCCESS, LIST_LP_FORSALE_FAIL,
    UNLIST_LP_FORSALE_REQUEST, UNLIST_LP_FORSALE_SUCCESS, UNLIST_LP_FORSALE_FAIL,
    LISTED_ITEMS_REQUEST, LISTED_ITEMS_SUCCESS, LISTED_ITEMS_FAIL, LISTED_ITEMS_CLEAR
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
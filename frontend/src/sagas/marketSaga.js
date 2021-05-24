import { takeEvery, call, put, all, select } from 'redux-saga/effects'

import {
    listLpForSaleService, unlistLpForSaleService, getListedItemsService,
    makeOfferService, getReceivedOffersService, getSendedOffersService,
    rejectOfferService, acceptOfferService, rateOfferService
} from '../services/marketServices'
import * as marketActions from '../actions/marketActions'
import { showAlert } from '../actions/alertActions'
import {
    LIST_LP_FORSALE_REQUEST, UNLIST_LP_FORSALE_REQUEST,
    LISTED_ITEMS_REQUEST,
    MAKE_OFFER_REQUEST,
    LOAD_RECEIVED_OFFERS_REQUEST,
    LOAD_SENDED_OFFERS_REQUEST,
    REJECT_OFFER_REQUEST,
    ACCEPT_OFFER_REQUEST,
    RATE_OFFER_REQUEST
} from '../constants/marketActionTypes'
import { selectUserInfo } from '../reducers/selectors'

function* listLpForSale({ payload }) {
    try {
        const { lpId, formData } = payload

        const userInfo = yield select(selectUserInfo)
        const { data } = yield call(listLpForSaleService, userInfo, lpId, formData)
        const resp = data
        yield put(marketActions.listLpForSaleSuccess(resp))
        yield put(showAlert('success', { messageKey: 'lpDetail.sell.listedSuccess' }))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(marketActions.listLpForSaleFail(errorMsg))
        if (!error.response || error.response.status !== 401)
            yield put(showAlert('error', { messageKey: 'lpDetail.sell.listedFail' }))
    }
}

function* unlistLpForSale({ payload }) {
    try {
        const listedItemId = payload

        const userInfo = yield select(selectUserInfo)
        const { data } = yield call(unlistLpForSaleService, userInfo, listedItemId)
        if (data.status === "success") {
            yield put(marketActions.unlistLpForSaleSuccess(userInfo.username))
            yield put(showAlert('info', { messageKey: 'unlistLp.unlistedSuccess' }))
        }
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(marketActions.unlistLpForSaleFail(errorMsg))
        if (!error.response || error.response.status !== 401)
            yield put(showAlert('error', { messageKey: 'unlistLp.unlistedFail' }))
    }
}

function* listedItems({ payload }) {
    try {
        const params = payload
        const userInfo = yield select(selectUserInfo)
        const { data } = yield call(getListedItemsService, userInfo, params)
        const listeditems = data
        yield put(marketActions.getListedItemsSuccess(listeditems))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(marketActions.getListedItemsFail(errorMsg))
        if (!error.response || error.response.status !== 401)
            yield put(showAlert('error', { messageKey: 'generic.fail' }))
    }
}

function* makeOffer({ payload }) {
    try {
        const { listedItemId, offer } = payload

        const userInfo = yield select(selectUserInfo)
        const { data } = yield call(makeOfferService, userInfo, listedItemId, offer)
        const resp = data
        yield put(marketActions.makeOfferSuccess(resp))
        yield put(showAlert('success', { messageKey: 'listedItemDetail.offerSuccess' }))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(marketActions.makeOfferFail(errorMsg))
        if (!error.response || error.response.status !== 401)
            yield put(showAlert('error', { messageKey: 'generic.fail' }))
    }
}

function* loadReceivedOffers() {
    try {
        const userInfo = yield select(selectUserInfo)
        const { data } = yield call(getReceivedOffersService, userInfo)
        const groupedOffers = data
        yield put(marketActions.getReceivedOffersSuccess(groupedOffers))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(marketActions.getReceivedOffersFail(errorMsg))
        if (!error.response || error.response.status !== 401)
            yield put(showAlert('error', { messageKey: 'generic.fail' }))
    }
}

function* loadSendedOffers() {
    try {
        const userInfo = yield select(selectUserInfo)
        const { data } = yield call(getSendedOffersService, userInfo)
        const groupedOffers = data
        yield put(marketActions.getSendedOffersSuccess(groupedOffers))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(marketActions.getSendedOffersFail(errorMsg))
        if (!error.response || error.response.status !== 401)
            yield put(showAlert('error', { messageKey: 'generic.fail' }))
    }
}

function* rejectOffer({ payload }) {
    const { offer } = payload
    try {
        const userInfo = yield select(selectUserInfo)
        const { data } = yield call(rejectOfferService, userInfo, offer._id)
        const resp = data
        yield put(marketActions.rejectOfferSuccess(resp))
        yield put(showAlert('info', { messageKey: 'receivedOffers.offerRejected' }))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(marketActions.rejectOfferFail({ offer: offer, error: errorMsg }))
        if (!error.response || error.response.status !== 401)
            yield put(showAlert('error', { messageKey: 'generic.fail' }))
    }
}

function* acceptOffer({ payload }) {
    const { offer } = payload
    try {
        const userInfo = yield select(selectUserInfo)
        const { data } = yield call(acceptOfferService, userInfo, offer._id)
        const resp = data
        yield put(marketActions.acceptOfferSuccess(resp))
        yield put(showAlert('success', { messageKey: 'receivedOffers.offerAccepted' }))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(marketActions.acceptOfferFail({ offer: offer, error: errorMsg }))
        if (!error.response || error.response.status !== 401)
            yield put(showAlert('error', { messageKey: 'generic.fail' }))
    }
}

function* rateOffer({ payload }) {
    const { offer, score, userType } = payload
    try {
        const userInfo = yield select(selectUserInfo)
        const { data } = yield call(rateOfferService, userInfo, offer._id, score)
        const resp = data
        yield put(marketActions.rateOfferSuccess(resp, userType))
        yield put(showAlert('success', { messageKey: 'offer.rateSuccess' }))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(marketActions.rateOfferFail({ offer: offer, error: errorMsg, userType }))
        if (!error.response || error.response.status !== 401)
            yield put(showAlert('error', { messageKey: 'generic.fail' }))
    }
}

function* watchListLpForSale() {
    yield takeEvery(LIST_LP_FORSALE_REQUEST, listLpForSale)
}

function* watchUnlistLpForSale() {
    yield takeEvery(UNLIST_LP_FORSALE_REQUEST, unlistLpForSale)
}

function* watchListedItems() {
    yield takeEvery(LISTED_ITEMS_REQUEST, listedItems)
}

function* watchMakeOffer() {
    yield takeEvery(MAKE_OFFER_REQUEST, makeOffer)
}

function* watchLoadReceivedOffers() {
    yield takeEvery(LOAD_RECEIVED_OFFERS_REQUEST, loadReceivedOffers)
}

function* watchLoadSendedOffers() {
    yield takeEvery(LOAD_SENDED_OFFERS_REQUEST, loadSendedOffers)
}

function* watchRejectOffer() {
    yield takeEvery(REJECT_OFFER_REQUEST, rejectOffer)
}

function* watchAcceptOffer() {
    yield takeEvery(ACCEPT_OFFER_REQUEST, acceptOffer)
}

function* watchRateOffer() {
    yield takeEvery(RATE_OFFER_REQUEST, rateOffer)
}

export function* marketSaga() {
    yield all([
        watchListLpForSale(),
        watchUnlistLpForSale(),
        watchListedItems(),
        watchMakeOffer(),
        watchLoadReceivedOffers(),
        watchLoadSendedOffers(),
        watchRejectOffer(),
        watchAcceptOffer(),
        watchRateOffer()
    ])
}

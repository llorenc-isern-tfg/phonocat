import { takeEvery, takeLatest, call, put, all, select } from 'redux-saga/effects'

import {
    listLpForSaleService, unlistLpForSaleService, getListedItemsService
} from '../services/marketServices'
import * as marketActions from '../actions/marketActions'
import { showAlert } from '../actions/alertActions'
import {
    LIST_LP_FORSALE_REQUEST, UNLIST_LP_FORSALE_REQUEST,
    LISTED_ITEMS_REQUEST
} from '../constants/marketActionTypes'
import { selectUserInfo } from '../reducers/selectors'
import history from '../history'

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
        yield put(showAlert('error', { messageKey: 'listedItems.fail' }))
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

export function* marketSaga() {
    yield all([
        watchListLpForSale(),
        watchUnlistLpForSale(),
        watchListedItems()
    ])
}

import { takeEvery, takeLatest, call, put, all, select } from 'redux-saga/effects'

import {
    listLpForSaleService, unlistLpForSaleService
} from '../services/marketServices'
import * as marketActions from '../actions/marketActions'
import { showAlert } from '../actions/alertActions'
import {
    LIST_LP_FORSALE_REQUEST, UNLIST_LP_FORSALE_REQUEST
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

function* watchListLpForSale() {
    yield takeEvery(LIST_LP_FORSALE_REQUEST, listLpForSale)
}

function* watchUnlistLpForSale() {
    yield takeEvery(UNLIST_LP_FORSALE_REQUEST, unlistLpForSale)
}

export function* marketSaga() {
    yield all([
        watchListLpForSale(),
        watchUnlistLpForSale()
    ])
}

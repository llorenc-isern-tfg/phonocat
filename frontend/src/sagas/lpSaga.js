import { takeEvery, takeLatest, call, put, all, select } from 'redux-saga/effects'

import { searchAlbumsService } from '../services/lastFmServices'
import { preloadAlbumDataService, addLpService, getLpCollectionService } from '../services/lpServices'
import * as lpActions from '../actions/lpActions'
import { showAlert } from '../actions/alertActions'
import { LP_ADD_REQUEST, LP_AUTOCOMPLETE_SEARCH_REQUEST, LP_FETCH_EXTERNAL_DATA_REQUEST, LP_COLLECTION_REQUEST } from '../constants/lpActionTypes'
import { selectUserInfo } from '../reducers/selectors'

function* autocomplete({ payload }) {
    try {
        const searchTerm = payload

        const { data } = yield call(searchAlbumsService, searchTerm)
        const searchResults = data.results.albummatches.album.filter((album) => { return !album.name.includes("(") && !album.name.includes("[") })
        yield put(lpActions.lpAutocompleteSearchSuccess({ searchTerm, searchResults }))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(lpActions.lpAutocompleteSearchFail(errorMsg))
        yield put(showAlert('error', { messageKey: 'lastFm.searchAlbum.unavailable' }))
    }
}

function* preload({ payload }) {
    let searchResult = payload

    searchResult = {
        title: searchResult.name,
        artist: searchResult.artist,
        coverImg: searchResult.image.find((img) => (img.size === "extralarge"))["#text"]
    }
    try {
        const userInfo = yield select(selectUserInfo)
        const { data } = yield call(preloadAlbumDataService, userInfo, searchResult)
        const preloadedData = data
        yield put(lpActions.lpPreloadExternalDataSuccess({ searchResult, preloadedData }))
        yield put(showAlert('success', { messageKey: 'searchAlbum.preloadDataComplete' }))
    } catch (error) {
        //TODO: comprovar 401
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(lpActions.lpPreloadExternalDataFail(errorMsg, searchResult))
        yield put(showAlert('warning', { messageKey: 'searchAlbum.preloadDataNotFound' }))
    }
}

function* addLp({ payload }) {
    try {
        const lp = payload

        const userInfo = yield select(selectUserInfo)
        const { data } = yield call(addLpService, userInfo, lp)
        alert(JSON.stringify(data))
        yield put(lpActions.lpAddSuccess({ lp: data }))
        yield put(showAlert('success', { messageKey: 'addLP.saved' }))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(lpActions.lpAutocompleteSearchFail(errorMsg))
        yield put(showAlert('error', { messageKey: 'addLP.fail' }))
    }
}

function* lpCollection() {
    try {
        const userInfo = yield select(selectUserInfo)
        const { data } = yield call(getLpCollectionService, userInfo)
        const lps = data
        yield put(lpActions.lpCollectionSuccess(lps))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(lpActions.lpCollectionFail(errorMsg))
        yield put(showAlert('error', { messageKey: 'lpCollection.error' }))
    }
}

function* watchAutocomplete() {
    yield takeLatest(LP_AUTOCOMPLETE_SEARCH_REQUEST, autocomplete)
}

function* watchPreload() {
    yield takeLatest(LP_FETCH_EXTERNAL_DATA_REQUEST, preload)
}

function* watchAddLp() {
    yield takeEvery(LP_ADD_REQUEST, addLp)
}

function* watchLpCollection() {
    yield takeLatest(LP_COLLECTION_REQUEST, lpCollection)
}

export function* lpSaga() {
    yield all([
        watchAutocomplete(),
        watchPreload(),
        watchAddLp(),
        watchLpCollection()
    ])
}
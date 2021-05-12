import { takeEvery, takeLatest, call, put, all, select } from 'redux-saga/effects'

import { searchAlbumsService } from '../services/lastFmServices'
import {
    preloadAlbumDataService, addLpService, getLpCollectionService,
    deleteLpService, uploadLpCover, getLpDetailsService, editLpService
} from '../services/lpServices'
import * as lpActions from '../actions/lpActions'
import { showAlert } from '../actions/alertActions'
import {
    LP_ADD_REQUEST, LP_AUTOCOMPLETE_SEARCH_REQUEST, LP_FETCH_EXTERNAL_DATA_REQUEST,
    LP_COLLECTION_REQUEST, LP_DELETE_REQUEST, LP_ADD_COVER_REQUEST,
    LP_DETAILS_REQUEST, LP_EDIT_COVER_REQUEST, LP_EDIT_REQUEST
} from '../constants/lpActionTypes'
import { selectUserInfo } from '../reducers/selectors'
import history from '../history'

function* autocomplete({ payload }) {
    try {
        const searchTerm = payload

        const { data } = yield call(searchAlbumsService, searchTerm)
        const searchResults = data.results.albummatches.album.filter(
            (album) => { return !album.name.includes("(") && !album.name.includes("[") }
        )
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
        yield put(lpActions.lpAddSuccess(data))
        yield put(showAlert('success', { messageKey: 'addLP.saved' }))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(lpActions.lpAddFail(errorMsg))
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

function* deleteLp({ payload }) {
    try {
        const id = payload

        const userInfo = yield select(selectUserInfo)
        yield call(deleteLpService, userInfo, id)
        yield put(lpActions.lpDeleteSuccess(id))
        yield put(showAlert('info', { messageKey: 'lpDelete.success' }))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(lpActions.lpDeleteFail(errorMsg))
        yield put(showAlert('error', { messageKey: 'lpDelete.fail' }))
    }
}

function* addLpCover({ payload }) {
    try {
        const { id, formData } = payload

        const userInfo = yield select(selectUserInfo)
        const { data } = yield call(uploadLpCover, userInfo, id, formData)
        const coverUrl = data
        yield put(lpActions.lpUploadCoverSuccess(coverUrl))
        yield put(showAlert('info', { messageKey: 'lpCover.uploaded' }))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(lpActions.lpUploadCoverFail(errorMsg))
        yield put(showAlert('error', { messageKey: 'lpCover.uploadFail' }))
    }
}

function* lpDetails({ payload }) {
    try {
        const id = payload

        const userInfo = yield select(selectUserInfo)
        const { data } = yield call(getLpDetailsService, userInfo, id)
        const lp = data
        yield put(lpActions.lpDetailsSuccess(lp))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(lpActions.lpDetailsFail(errorMsg))
    }
}

function* editLpCover({ payload }) {
    try {
        const { id, formData } = payload

        const userInfo = yield select(selectUserInfo)
        const { data } = yield call(uploadLpCover, userInfo, id, formData)
        const coverUrl = data
        yield put(lpActions.lpEditCoverSuccess(coverUrl))
        yield put(showAlert('info', { messageKey: 'lpCover.uploaded' }))
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(lpActions.lpEditCoverFail(errorMsg))
        yield put(showAlert('error', { messageKey: 'lpCover.uploadFail' }))
    }
}

function* editLp({ payload }) {
    try {
        const lp = payload

        const userInfo = yield select(selectUserInfo)
        const { data } = yield call(editLpService, userInfo, lp)
        yield put(lpActions.lpEditSuccess(data))
        yield put(showAlert('success', { messageKey: 'editLp.success' }))
        history.push('/lp/collection')
    } catch (error) {
        const errorMsg = error.response && error.response.data.message ?
            error.response.data.message : error.message
        yield put(lpActions.lpEditFail(errorMsg))
        yield put(showAlert('error', { messageKey: 'editLp.fail' }))
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

function* watchDeleteLp() {
    yield takeEvery(LP_DELETE_REQUEST, deleteLp)
}

function* watchAddLpCover() {
    yield takeEvery(LP_ADD_COVER_REQUEST, addLpCover)
}

function* watchLpDetails() {
    yield takeEvery(LP_DETAILS_REQUEST, lpDetails)
}

function* watchEditLpCover() {
    yield takeEvery(LP_EDIT_COVER_REQUEST, editLpCover)
}

function* watchEditLp() {
    yield takeEvery(LP_EDIT_REQUEST, editLp)
}

export function* lpSaga() {
    yield all([
        watchAutocomplete(),
        watchPreload(),
        watchAddLp(),
        watchLpCollection(),
        watchDeleteLp(),
        watchAddLpCover(),
        watchLpDetails(),
        watchEditLpCover(),
        watchEditLp()
    ])
}
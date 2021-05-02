import { takeLatest, call, put, all } from 'redux-saga/effects'

import { searchAlbumsService } from '../services/lastFmServices'
import * as lpActions from '../actions/lpActions'
import { showAlert } from '../actions/alertActions'
import { LP_AUTOCOMPLETE_SEARCH_REQUEST } from '../constants/lpActionTypes'

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



function* watchAutocomplete() {
    yield takeLatest(LP_AUTOCOMPLETE_SEARCH_REQUEST, autocomplete)
}

export function* lpSaga() {
    yield all([
        watchAutocomplete()
    ])
}
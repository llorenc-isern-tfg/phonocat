/* eslint-disable no-constant-condition */

import { take, put, call, fork, select, takeEvery, all } from 'redux-saga/effects'
import * as alertActions from '../actions/alertActions'

export function* showAlert(alert) {
    yield put(alert)
}

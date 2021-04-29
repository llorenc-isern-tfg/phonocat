import _ from 'lodash'

import { ALERT_SHOW, ALERT_CLEAR } from '../constants/alertActionsTypes'


//Per defecte fem que les alertes durin 4 segons
export const showAlert = (alertType, message, duration = 4000) => dispatch => {
    //assignem un id unic a l'alerta per si n'hi ha més a la cua
    const id = _.uniqueId()
    dispatch({ type: ALERT_SHOW, payload: { id, alertType, message, duration } })
}

export const clearAlert = (id) => dispatch => {
    dispatch({ type: ALERT_CLEAR, payload: id })
}
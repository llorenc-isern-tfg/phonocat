import _ from 'lodash'

import { ALERT_SHOW, ALERT_CLEAR } from '../constants/alertActionsTypes'

const action = (type, payload = {}) => ({ type, payload })

export const showAlert = (alertType, message, duration = 3000) => {
    const id = _.uniqueId()
    return action(ALERT_SHOW, { id, alertType, message, duration })
}

export const clearAlert = id => (action(ALERT_CLEAR, id))
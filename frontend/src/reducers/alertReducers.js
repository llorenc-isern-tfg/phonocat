import { ALERT_SHOW, ALERT_CLEAR } from '../constants/alertActionsTypes'


export const alertReducer = (state = [], action) => {

    const { type, payload } = action

    switch (type) {
        case ALERT_SHOW:
            //afegim la nova alerta a la cua
            return [...state, payload]
        case ALERT_CLEAR:
            //esborrem l'alerta amb un id determinat de la cua
            return state.filter(alert => alert.id !== payload)
        default:
            return state
    }

}
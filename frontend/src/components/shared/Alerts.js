import React, { useState, useEffect } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from "react-i18next"

import { clearAlert } from '../../actions/alertActions'

const AppAlert = () => {

    const alerts = useSelector(state => state.alerts)
    const [currentAlert, setCurrentAlert] = useState(null);
    const [open, setOpen] = useState(false);

    const dispatch = useDispatch()

    useEffect(() => {
        if (alerts.length && !currentAlert) {
            // Set d'una nova alerta quan no hi ha cap activa
            const alert = alerts[0]
            setCurrentAlert({
                severity: alert.alertType,
                message: alert.message,
                duration: alert.duration
            })
            //una vegada hem creat l'alerta la podem esborrar de la cua de redux
            dispatch(clearAlert(alert.id))
            setOpen(true)
        } else if (alerts.length && currentAlert && open) {
            // Tanquem l'alerta activa quan hi ha una de nova
            setOpen(false)
        }
    }, [alerts, currentAlert, open]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleExited = () => {
        setCurrentAlert(null);
    };

    const { t } = useTranslation();

    return (
        <Snackbar open={open} autoHideDuration={currentAlert ? currentAlert.duration : 0}
            onClose={handleClose}
            onExited={handleExited}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <MuiAlert elevation={6} variant="filled"
                severity={currentAlert && currentAlert.severity}>
                {currentAlert && t(currentAlert.message.messageKey, currentAlert.message.params)}
            </MuiAlert>
        </Snackbar>
    )

}

export default AppAlert

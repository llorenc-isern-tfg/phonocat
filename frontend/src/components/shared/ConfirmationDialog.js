import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

const ConfirmationDialog = ({ dialogProps }) => {
    return (
        <Dialog
            open={dialogProps ? dialogProps.open : false}
            onClose={dialogProps.handleCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{dialogProps.title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {dialogProps.message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={dialogProps.handleCancel} color="default" >
                    {dialogProps.cancelButtonMsg}
                </Button>
                <Button onClick={dialogProps.handleConfirm} color="secondary" autoFocus>
                    {dialogProps.confirmButtonMsg}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmationDialog

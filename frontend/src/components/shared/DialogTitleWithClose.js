import React from 'react'
import Box from '@material-ui/core/DialogTitle';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from "react-i18next";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    }
}));

const DialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    const classes = useStyles()
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h5" align="center">{children}</Typography>
            {onClose && (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            )}
        </MuiDialogTitle>
    )
}

const DialogTitleWithClose = ({ title, onClose }) => {
    const { t } = useTranslation();
    return (
        <DialogTitle id="login-dialog-title" onClose={onClose}>
            {title}
        </DialogTitle>
    )
}

export default DialogTitleWithClose


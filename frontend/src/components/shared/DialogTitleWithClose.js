import React from 'react'
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
    const { children, onClose, subtitle, ...other } = props;
    const classes = useStyles()
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h5" align="center">{children}</Typography>
            {onClose && (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            )}
            {subtitle &&
                <Typography variant="subtitle1" align="center">{subtitle}</Typography>
            }
        </MuiDialogTitle>
    )
}

const DialogTitleWithClose = ({ title, subtitle, backgroundColor, onClose }) => {

    return (
        <DialogTitle id="login-dialog-title" onClose={onClose} subtitle={subtitle}>
            {title}
        </DialogTitle>
    )
}

export default DialogTitleWithClose


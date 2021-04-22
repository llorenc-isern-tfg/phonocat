import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from "react-i18next"
import { useForm, Controller } from "react-hook-form";
// import * as yup from "yup";
// import { setLocale } from 'yup';

import ButtonSpinner from '../../components/shared/ButtonSpinner';
import DialogTitleWithClose from '../../components/shared/DialogTitleWithClose';
import { login } from '../../actions/userActions';

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
}))

// const loginSchema = yup.object().shape({
//     email: yup.string().email(),
//     password: yup.number().positive().integer().required(),
// });

const LoginDialog = ({ open, onClose }) => {

    const { t } = useTranslation();

    // const [email, setEmail] = useState('')
    // const [password, setPassword] = useState('')

    const auth = useSelector((state) => state.auth)
    const { userInfo, loading } = auth

    const dispatch = useDispatch()

    const onSubmit = data => {
        dispatch(login(data.email, data.password))
    }

    const classes = useStyles();

    const { handleSubmit, control } = useForm();

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="xs">
            <DialogTitleWithClose id="form-dialog-title" title={t('loginForm.signin')} onClose={onClose} />
            <DialogContent dividers>

                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOpenIcon />
                    </Avatar>
                    <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>

                        <Controller
                            name="email"
                            control={control}
                            defaultValue=""
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    label={t('loginForm.email')}
                                    autoComplete="email"
                                    autoFocus
                                    value={value}
                                    onChange={onChange}
                                    error={!!error} //<- es el mateix que fer error ? true : false
                                    helperText={error ? error.message : null}
                                />
                            )}
                            rules={{ required: 'Email required' }}
                        />

                        <Controller
                            name="password"
                            control={control}
                            defaultValue=""
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    label={t('loginForm.password')}
                                    type="password"
                                    autoComplete="current-password"
                                    value={value}
                                    onChange={onChange}
                                    error={!!error}
                                    helperText={error ? error.message : null}
                                />
                            )}
                            rules={{ required: 'Password required' }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={loading}
                        >
                            LOGIN
                            {/* Si es està fent login mostrem un spinner dins el botó */}
                            {loading && <ButtonSpinner />}
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    {t('loginForm.forgotPassword')}
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {t('loginForm.signup')}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </DialogContent>
        </Dialog >
    )
}

export default LoginDialog


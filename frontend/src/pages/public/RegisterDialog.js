import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from "react-i18next"
import { useFormik } from 'formik'
import * as yup from 'yup'
import { setLocale } from 'yup'


import ButtonSpinner from '../../components/shared/ButtonSpinner'
import DialogTitleWithClose from '../../components/shared/DialogTitleWithClose'
import { registerRequest } from '../../actions/userActions'
import yupMessages from '../../locales/yupMessages'
import { USERNAME_MIN_LENGTH, PASSWORD_MIN_LENGTH, LOGIN_DIALOG_ID } from '../../constants/constants'

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
    googleLogin: {
        width: '100%',
        marginBottom: 15
    }
}))


const RegisterDialog = ({ open, onClose, selectedLanguage, onChangeDialog }) => {

    const { t } = useTranslation();
    setLocale(yupMessages)


    const auth = useSelector((state) => state.auth)
    const { userInfo, loading } = auth

    const dispatch = useDispatch()

    const classes = useStyles();

    const loginSchema = yup.object().shape({
        username: yup.string().required().min(USERNAME_MIN_LENGTH).matches(/^(\d|\w)+$/, t('yup:noSpecialChars')),
        email: yup.string().email().required(),
        password: yup.string().required().min(PASSWORD_MIN_LENGTH),
        password2: yup.string().required().oneOf([yup.ref('password'), null], t('registerForm.differentPasswords'))
    })

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            password2: '',
        },
        validationSchema: loginSchema,
        onSubmit: values => {
            //Si l'usuari ha seleccionat un llenguatge el registrem amb aquest idioma com a preferència
            if (selectedLanguage)
                values.language = selectedLanguage
            dispatch(registerRequest(values))
        }
    })

    useEffect(() => {
        if (userInfo)
            handleClose()

    }, [userInfo])

    const handleClose = () => {
        onClose()
        //timeout per evitar efecte grafic quan es resetejen els missatges d'error i encara no s'ha tancat la pantalla modal
        setTimeout(formik.resetForm, 200)
    }

    const handleChange = (dialogId) => {
        onChangeDialog(dialogId)
        setTimeout(formik.resetForm, 200)
    }


    return (
        <Dialog open={!userInfo && open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="xs">
            <DialogTitleWithClose id="form-dialog-title" title={t('registerForm.signup')} onClose={onClose} />
            <DialogContent dividers>

                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOpenIcon />
                    </Avatar>
                    {/* Si el sistema d'alertes no funciona tornar a aquesta versió */}
                    {/* {error && <Alert severity="error">{error}</Alert>} */}
                    <form className={classes.form} noValidate onSubmit={formik.handleSubmit}>
                        <TextField
                            required
                            id="username"
                            name="username"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label={t('registerForm.username')}
                            autoFocus
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            error={formik.touched.username && Boolean(formik.errors.username)}
                            helperText={formik.touched.username && formik.errors.username}
                        />
                        <TextField
                            required
                            id="email"
                            name="email"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label={t('loginForm.email')}
                            autoComplete="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            required
                            name="password"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label={t('loginForm.password')}
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password ?
                                formik.errors.password : t('registerForm.passwordConstrain', { min: PASSWORD_MIN_LENGTH })}
                        />
                        <TextField
                            required
                            name="password2"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label={t('registerForm.passwordConfirm')}
                            type="password"
                            value={formik.values.password2}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password2)}
                            helperText={formik.touched.password && formik.errors.password2}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={loading}
                        >
                            {t('registerForm.signup').toUpperCase()}
                            {loading && <ButtonSpinner />}
                        </Button>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link href="#" onClick={() => handleChange(LOGIN_DIALOG_ID)} variant="body2">
                                    {t('registerForm.login')}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </DialogContent>
        </Dialog >
    )
}

export default RegisterDialog


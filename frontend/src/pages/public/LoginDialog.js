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
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from "react-i18next"
import { useFormik } from 'formik'
import * as yup from 'yup'
import { setLocale } from 'yup'
import GoogleLogin from 'react-google-login'
import { REGISTER_DIALOG_ID } from '../../constants/constants'


import ButtonSpinner from '../../components/shared/ButtonSpinner'
import DialogTitleWithClose from '../../components/shared/DialogTitleWithClose'
import { loginRequest, googleLoginRequest } from '../../actions/userActions'
import yupMessages from '../../locales/yupMessages'
import { PASSWORD_MIN_LENGTH } from '../../constants/constants'

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


const LoginDialog = ({ open, onClose, onChangeDialog }) => {

    const { t } = useTranslation();
    setLocale(yupMessages)


    const auth = useSelector((state) => state.auth)
    const { userInfo, loading } = auth

    const [showPassword, setShowPassword] = useState(false)

    const dispatch = useDispatch()

    const classes = useStyles();

    const loginSchema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().required().min(PASSWORD_MIN_LENGTH)
    })

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: loginSchema,
        onSubmit: values => {
            dispatch(loginRequest(values))
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

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    }

    const onGoogleAuthSuccess = (res) => {
        dispatch(googleLoginRequest({ id_token: res.tokenObj.id_token }))
        handleClose()
    }

    const handleChange = (dialogId) => {
        onChangeDialog(dialogId)
        setTimeout(formik.resetForm, 200)
    }

    return (
        <Dialog open={!userInfo && open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="xs">
            <DialogTitleWithClose id="form-dialog-title" title={t('loginForm.signin')} onClose={onClose} />
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
                            id="email"
                            name="email"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            type="email"
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
                            type={showPassword ? 'text' : 'password'}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            InputProps={
                                {
                                    //Icona per mostrar/amagar password
                                    endAdornment:
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                }
                            }
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
                        <GoogleLogin className={classes.googleLogin}
                            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                            buttonText={t('loginForm.google')}
                            onSuccess={(res) => onGoogleAuthSuccess(res)}
                            cookiePolicy={'single_host_origin'}
                        >{loading && <ButtonSpinner />}</GoogleLogin>
                        {/* </Link> */}
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link href="#" onClick={() => handleChange(REGISTER_DIALOG_ID)} variant="body2">
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


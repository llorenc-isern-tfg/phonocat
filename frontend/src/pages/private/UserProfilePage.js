import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Backdrop from '@material-ui/core/Backdrop'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import PersonIcon from '@material-ui/icons/Person'
import { Card, CardMedia } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from 'react-redux'

import { editProfileRequest, getUserProfileRequest, uploadProfilePictureRequest } from '../../actions/userActions'
import blankProfile from '../../images/blank-profile.png'
import DropImage from '../../components/shared/DropImage'
import ProfileForm from '../../components/user/ProfileForm'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer - 1,
        color: '#fff',
    },
    pictureBackdrop: {
        position: 'absolute',
        zIndex: theme.zIndex.drawer - 1,
        color: '#fff',
    },
    pictureCard: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '225px',
        maxHeight: '225px',
    },
    pictureCardMedia: {
        paddingTop: '100%'
    },
    wrapper: {
        margin: 0,
        position: 'relative',
    },
}))

const UserProfilePage = () => {

    const dispatch = useDispatch()

    const auth = useSelector((state) => state.auth)
    const { userInfo } = auth

    const userProfile = useSelector((state) => state.userProfile)
    const { status, user, editCover } = userProfile

    const [loadingPicture, setLoadingPicture] = useState(false)
    const [pictureImg, setpictureImg] = useState()

    useEffect(() => {
        dispatch(getUserProfileRequest())
    }, [])

    useEffect(() => {
        if (user && user.picture) {
            setpictureImg(user.picture)
        }

    }, [user])

    useEffect(() => {
        setLoadingPicture(editCover ? editCover.loading : false)

        if (editCover && !editCover.loading && editCover.picture && editCover.picture.url)
            setpictureImg(editCover.picture.url)

    }, [editCover])

    const uploadPicture = (file) => {
        var formData = new FormData()
        formData.append('picture', file)
        dispatch(uploadProfilePictureRequest({ formData }))
    }

    const handleSubmit = (userFormData) => {
        dispatch(editProfileRequest(userFormData))
    }


    const { t } = useTranslation()

    const classes = useStyles()

    const actions = () => {
        return (
            <div className={classes.buttons}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                >
                    {t('form.save')}
                </Button>
            </div>
        )
    }

    return (
        <React.Fragment>
            {user &&
                <Container maxWidth="xl">
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h4" align="center">
                            <PersonIcon fontSize="large" color="primary" /> {t('profile.title')}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            {t('profile.picture')}
                        </Typography>
                        <Grid container spacing={3} style={{ marginBottom: 5 }}>
                            <Grid item xs={12} sm={6}>
                                <Card className={classes.pictureCard} elevation={4}>
                                    <div className={classes.wrapper}>
                                        <CardMedia className={classes.pictureCardMedia}
                                            image={pictureImg ? pictureImg : blankProfile}
                                        />
                                        <Backdrop className={classes.pictureBackdrop} open={loadingPicture}>
                                            <CircularProgress color="inherit" />
                                        </Backdrop>
                                    </div>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <DropImage label={t('profile.editPicture')} onUpload={uploadPicture} maxFiles={1} />
                            </Grid>
                        </Grid>
                        <React.Fragment>
                            <ProfileForm userData={user} actions={actions} handleSubmit={handleSubmit} />
                        </React.Fragment>
                    </Paper>
                    {/* <Backdrop className={classes.backdrop} open={(status && status.loading) ? status.loading : false}>
                    <CircularProgress color="inherit" />
                </Backdrop> */}
                </Container>
            }
        </React.Fragment >
    )
}

export default UserProfilePage

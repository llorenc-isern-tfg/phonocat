import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Backdrop from '@material-ui/core/Backdrop'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { Card, CardMedia } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import EditIcon from '@material-ui/icons/Edit'

import LpForm from '../../components/lps/LpForm'
import { lpDetailsRequest, lpDetailsClear } from '../../actions/lpActions'
import { LP_DETAILS_FAIL } from '../../constants/lpActionTypes'
import history from '../../history'
import defaultCoverImg from '../../images/lp_cover_default.png'
import DropImage from '../../components/shared/DropImage'
import { lpEditCoverRequest, lpEditRequest } from '../../actions/lpActions'

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
    coverBackdrop: {
        position: 'absolute',
        zIndex: theme.zIndex.drawer - 1,
        color: '#fff',
    },
    coverCard: {
        // height: '100%',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '225px',
        maxHeight: '225px',
    },
    coverCardMedia: {
        paddingTop: '100%',
        backgroundColor: theme.palette.primary[200]
    },
    wrapper: {
        margin: 0,
        position: 'relative',
    },
}))

const EditLpPage = ({ match }) => {

    const dispatch = useDispatch()

    const lpId = match.params.id

    const lpDetails = useSelector((state) => state.lpDetails)
    const { status, lp } = lpDetails

    const lpEdit = useSelector((state) => state.lpEdit)

    const [loadingCover, setLoadingCover] = useState(false)
    const [coverImg, setCoverImg] = useState()

    useEffect(() => {
        dispatch(lpDetailsRequest(lpId))
        return () => dispatch(lpDetailsClear())
    }, [])

    useEffect(() => {
        if (lp && lp.coverImg) {
            setCoverImg(lp.coverImg)
        }

    }, [lp])

    useEffect(() => {
        if (status && status.type === LP_DETAILS_FAIL) {
            dispatch(lpDetailsClear())
            history.push('/lp/collection')
        }

    }, [status])

    useEffect(() => {
        setLoadingCover(lpEdit.editCover && lpEdit.editCover.loading)

        if (lpEdit.editCover && !lpEdit.editCover.loading && lpEdit.editCover.uploadCover.coverImg)
            setCoverImg(lpEdit.editCover.uploadCover.coverImg)

    }, [lpEdit])


    const { t } = useTranslation()

    const actions = () => {
        return (
            <div className={classes.buttons}>
                <Button variant="contained" color="default" className={classes.button}
                    component={Link} to="/lp/collection/">
                    {t('form.exit')}
                </Button>
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

    const uploadFileCover = (file) => {
        var formData = new FormData()
        formData.append('cover', file)
        formData.append('method', 'file')
        dispatch(lpEditCoverRequest({ id: lpId, formData }))
    }

    const handleSubmit = (lp) => {
        lp._id = lpId
        dispatch(lpEditRequest(lp))
    }

    const classes = useStyles()

    return (
        <React.Fragment>
            {lp &&
                <Container maxWidth="xl">
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h4" align="center">
                            <EditIcon fontSize="large" color="primary" /> {t('lpEdit.title')}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            {t('lpEdit.cover')}
                        </Typography>
                        <Grid container spacing={3} style={{ marginBottom: 5 }}>
                            <Grid item xs={12} sm={6}>
                                <Card className={classes.coverCard} elevation={4}>
                                    <div className={classes.wrapper}>
                                        <CardMedia className={classes.coverCardMedia}
                                            image={coverImg ? coverImg : defaultCoverImg}
                                        />
                                        <Backdrop className={classes.coverBackdrop} open={loadingCover}>
                                            <CircularProgress color="inherit" />
                                        </Backdrop>
                                    </div>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <DropImage label={t('lpEdit.editCover')} onUpload={uploadFileCover} />
                            </Grid>
                        </Grid>
                        <React.Fragment>
                            <LpForm lpData={lp} actions={actions} handleSubmit={handleSubmit} />
                        </React.Fragment>
                    </Paper>
                    <Backdrop className={classes.backdrop} open={(status && status.loading) ? status.loading : false}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </Container>
            }
        </React.Fragment >
    )

}

export default EditLpPage

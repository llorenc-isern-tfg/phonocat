import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Backdrop from '@material-ui/core/Backdrop'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Rating from '@material-ui/lab/Rating'
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Card, CardMedia } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';

import { lpDetailsRequest, lpDetailsClear } from '../../actions/lpActions'
import defaultCoverImg from '../../images/lp_cover_default.png'
import ConditionIcon from '../../components/lps/ConditionIcon'
import TrackList from '../../components/lps/TrackList'

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
    },
    coverCardMedia: {
        paddingTop: '100%',
        backgroundColor: theme.palette.primary[200]
    },
    lpInfo: {
        width: '100%',
        padding: theme.spacing(2),
        backgroundColor: theme.palette.primary[50],
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}))

const Accordion = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiAccordionDetails);

const UserDetailPage = ({ match }) => {

    const lpId = match.params.id

    const dispatch = useDispatch()

    const lpDetails = useSelector((state) => state.lpDetails)
    const { status, lp } = lpDetails

    useEffect(() => {
        dispatch(lpDetailsRequest(lpId))
        return () => dispatch(lpDetailsClear())
    }, [])


    const auth = useSelector((state) => state.auth)
    const { userInfo } = auth

    const { t } = useTranslation()
    const classes = useStyles()

    return (
        <React.Fragment>
            {lp &&
                <Container maxWidth="xl">
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h4" align="center">
                            {lp.title}
                        </Typography>
                        <Typography variant="h6" color="textSecondary" align="center" gutterBottom>
                            {lp.artist.name}
                        </Typography>
                        <Grid container spacing={3} style={{ marginBottom: 5 }}>
                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                <Card className={classes.coverCard} elevation={4}>
                                    <CardMedia className={classes.coverCardMedia}
                                        image={lp.coverImg ? lp.coverImg : defaultCoverImg}
                                    />
                                </Card>
                            </Grid>
                            <Grid container spacing={2} item xs={12} sm={6} md={8} lg={8} >
                                <Paper elevation={0} className={classes.lpInfo}>
                                    {lp.label &&
                                        <Grid item xs={12} sm={6} md={8} lg={8}>
                                            <Typography variant="subtitle1" color="textSecondary">{t('lpDetail.discoLabel')}</Typography>
                                            <Typography variant="subtitle2" >{lp.label}</Typography>
                                        </Grid>
                                    }
                                    <Grid item xs={12} sm={6} md={8} lg={8}>
                                        <Typography variant="subtitle1" color="textSecondary">{t('lpDetail.genre')}</Typography>
                                        <Typography variant="subtitle2" >{lp.genre}</Typography>
                                    </Grid>
                                    {lp.country &&
                                        <Grid item xs={12} sm={6} md={8} lg={8}>
                                            <Typography variant="subtitle1" color="textSecondary">{t('lpDetail.releaseCountry')}</Typography>
                                            <Typography variant="subtitle2" >{t(`country:${lp.country}`)}</Typography>
                                        </Grid>
                                    }
                                    {lp.year &&
                                        <Grid item xs={12} sm={6} md={8} lg={8}>
                                            <Typography variant="subtitle1" color="textSecondary">{t('lpDetail.releaseYear')}</Typography>
                                            <Typography variant="subtitle2" >{lp.year}</Typography>
                                        </Grid>
                                    }
                                    {lp.numDiscs &&
                                        <Grid item xs={12} sm={6} md={8} lg={8}>
                                            <Typography variant="subtitle1" color="textSecondary">{t('lpDetail.numDiscs')}</Typography>
                                            <Typography variant="subtitle2" >{lp.numDiscs}</Typography>
                                        </Grid>
                                    }
                                    {lp.condition &&
                                        <Grid item xs={12} sm={6} md={8} lg={8}>
                                            <Typography variant="subtitle1" color="textSecondary">{t('lpDetail.condition')}</Typography>
                                            <Typography variant="subtitle2" ><ConditionIcon condition={lp.condition} /> {t(`select:albumCondition.${lp.condition}`)}</Typography>
                                        </Grid>
                                    }
                                    {lp.weight &&
                                        <Grid item xs={12} sm={6} md={8} lg={8}>
                                            <Typography variant="subtitle1" color="textSecondary">{t('lpDetail.weight')}</Typography>
                                            <Typography variant="subtitle2" >{t(`select:albumWeight.${lp.weight}`)}</Typography>
                                        </Grid>
                                    }
                                    {lp.channel &&
                                        <Grid item xs={12} sm={6} md={8} lg={8}>
                                            <Typography variant="subtitle1" color="textSecondary">{t('lpDetail.channel')}</Typography>
                                            <Typography variant="subtitle2" >{lp.channel}</Typography>
                                        </Grid>
                                    }
                                    <Grid item xs={12} sm={6} md={8} lg={8}>
                                        <Typography variant="subtitle1" color="textSecondary">{t('lpDetail.visibility')}</Typography>
                                        <Typography variant="subtitle2" >{lp.isPublic ? t('lpDetail.public') : t('lpDetail.private')}</Typography>
                                    </Grid>
                                </Paper>
                            </Grid>
                            {lp.review &&
                                <Grid item xs={12}>
                                    <Accordion defaultExpanded>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography className={classes.heading}>{t('lpDetail.score')}
                                                <Rating
                                                    id="rating"
                                                    name="rating"
                                                    value={lp.review.rating}
                                                    readOnly
                                                />
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                {lp.review.comment}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                            }
                            {lp.trackList && lp.trackList.length > 0 && <TrackList trackList={lp.trackList} />}
                        </Grid>
                        <div className={classes.buttons}>
                            <Button variant="contained" color="primary" className={classes.button}
                                component={Link} to="/lp/collection">
                                {t('form.exit')}
                            </Button>
                        </div>
                    </Paper>
                    <Backdrop className={classes.backdrop} open={(status && status.loading) ? status.loading : false}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </Container>
            }
        </React.Fragment >

        //TODO: import mirar https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
    )
}

export default UserDetailPage

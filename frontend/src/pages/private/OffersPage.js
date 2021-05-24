import React, { useEffect } from 'react'
import ReceivedIcon from '@material-ui/icons/CallReceived'
import SendedIcon from '@material-ui/icons/CallMade'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from 'react-redux'
import List from '@material-ui/core/List'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import _ from 'lodash'
import Avatar from '@material-ui/core/Avatar'
import CircularProgress from '@material-ui/core/CircularProgress'

import ReceivedOffersByLp from '../../components/market/ReceivedOffersByLp'
import {
    getReceivedOffersRequest, getReceivedOffersClear,
    getSendedOffersRequest, getSendedOffersClear
} from '../../actions/marketActions'
import SendedOffer from '../../components/market/SendedOffer'
import { Divider } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    paper: {
        minHeight: theme.spacing(15),
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: 0,
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
        },
    },
    titleIcon: {
        color: theme.palette.getContrastText(theme.palette.primary[500]),
        backgroundColor: theme.palette.primary[500],
        width: theme.spacing(4),
        height: theme.spacing(4),
        marginRight: theme.spacing(1)
    },
    titleBox: {
        padding: theme.spacing(2)
    },
    offersContainer: {
        paddingRight: theme.spacing(1),
        paddingLeft: theme.spacing(1),
    },
    titleDivider: {
        marginBottom: theme.spacing(2)
    }
}))


const OffersPage = () => {

    const { t } = useTranslation(['translation', 'country'])

    const dispatch = useDispatch()

    const classes = useStyles()

    const { groupedOffers, loading } = useSelector(state => state.receivedOffers)

    const { sendedOffers, loadingSended } = useSelector(state => state.sendedOffers)

    //Quan es renderitza el component per primera vegada, carreguem els llistats d'ofertes rebudes i enviades
    useEffect(() => {
        dispatch(getReceivedOffersRequest())
        dispatch(getSendedOffersRequest())
        //netejem el llistat al sortir de la pàgina
        return () => {
            dispatch(getReceivedOffersClear())
            dispatch(getSendedOffersClear())
        }
    }, [])

    return (
        <Container maxWidth="xl">
            <Grid container >
                <Grid item xs={12} sm={6} className={classes.offersContainer}>
                    <Paper className={classes.paper}>
                        <Box className={classes.titleBox} >
                            <Grid container>
                                <Grid item>
                                    <Avatar className={classes.titleIcon}><ReceivedIcon /></Avatar>
                                </Grid>
                                <Grid item>
                                    <Typography component="h1" variant="h6" align="center">
                                        {t('receivedOffers.title')}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                        <Divider className={classes.titleDivider} />
                        {groupedOffers.length > 0 ?
                            <List className={classes.root}>
                                {groupedOffers.map((lpOffers, index) => <ReceivedOffersByLp lpOffers={lpOffers} key={lpOffers.listedItem._id} />)}
                            </List>
                            :
                            <Grid container direction="column"
                                justify="center"
                                alignItems="center">
                                <Grid item xs>
                                    {loading ?
                                        <CircularProgress />
                                        :
                                        <Typography variant="subtitle2"> {t('receivedOffers.empty')}</Typography>
                                    }
                                </Grid>
                            </Grid>
                        }
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} className={classes.offersContainer}>
                    <Paper className={classes.paper}>
                        <Box className={classes.titleBox}>
                            <Grid container>
                                <Grid item>
                                    <Avatar className={classes.titleIcon}><SendedIcon /></Avatar>
                                </Grid>
                                <Grid item>
                                    <Typography component="h1" variant="h6" align="center">
                                        {t('sendedOffers.title')}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                        <Divider className={classes.titleDivider} />
                        {sendedOffers.length > 0 ?
                            <List className={classes.root}>
                                {sendedOffers.map((sendedOffer, index) => <SendedOffer offer={sendedOffer} key={sendedOffer._id} />)}
                            </List>
                            :
                            <Grid container direction="column"
                                justify="center"
                                alignItems="center">
                                <Grid item xs>
                                    {loadingSended ?
                                        <CircularProgress />
                                        :
                                        <Typography variant="subtitle2"> {t('sendedOffers.empty')}</Typography>
                                    }
                                </Grid>
                            </Grid>
                        }
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default OffersPage

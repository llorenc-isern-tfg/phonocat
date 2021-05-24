import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import { useTranslation } from "react-i18next"
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Rating from '@material-ui/lab/Rating'
import { useDispatch } from 'react-redux'

import defaultCoverImg from '../../images/lp_cover_default.png'
import { rateOfferRequest } from '../../actions/marketActions'
import { Divider } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    rateButton: {
        marginTop: -theme.spacing(2)
    }

}))

const SendedOffer = ({ offer }) => {

    const { lp } = offer.listedItem
    const classes = useStyles()

    const dispatch = useDispatch()

    const [score, setScore] = useState(0)

    const { t } = useTranslation(['translation', 'country'])

    const handleRate = offer => dispatch(rateOfferRequest(offer, score, 'buyer'))

    return (
        <React.Fragment>
            <Divider />
            <ListItem alignItems="flex-start" >
                <ListItemIcon>
                    <Avatar src={lp.coverImg ? lp.coverImg : defaultCoverImg}
                        variant="rounded"
                        className={classes.cover} style={{ margin: 'auto' }} />
                </ListItemIcon>
                <ListItemText primary={
                    <Typography
                        component="span"
                        variant="body1"
                    >
                        {lp.title} - {t('sendedOffers.sendedFor', { price: offer.suggestedPrice })}
                    </Typography>
                }
                    disableTypography secondary={
                        <React.Fragment>
                            <Typography
                                // component="span"
                                variant="body2"
                                color={offer.status === 'pending' ? 'textSecondary' : (offer.status === 'accepted' ? 'primary' : 'secondary')}
                            >
                                {t(`sendedOffers.inStatus.${offer.status}`)}
                            </Typography>
                            {offer.status === 'accepted' &&
                                <React.Fragment>
                                    {!offer.buyerReview && <Typography variant="body2" color="textSecondary" gutterBottom >
                                        {t('offer.rate')}&nbsp;&nbsp;
                                                    </Typography>}
                                    <Rating
                                        readOnly={offer.buyerReview ? true : false}
                                        id={"rating_" + offer._id}
                                        name={"rating_" + offer._id}
                                        value={offer.buyerReview ? offer.buyerReview.rating : score}
                                        onChange={(event, value) => {
                                            setScore(value)
                                        }}
                                    />
                                    {!offer.buyerReview && <Button size="small" color="primary" disabled={offer.rating}
                                        onClick={() => handleRate(offer)}
                                        className={classes.rateButton} >
                                        {t('offer.rateButton')}
                                    </Button>}
                                </React.Fragment>
                            }
                        </React.Fragment>
                    } />
            </ListItem >
        </React.Fragment>
    )
    /* <Grid container wrap="nowrap" spacing={2}>
        <Grid item>
            <Avatar alt={offer.listedItem.lp.title} src={offer.listedItem.lp.coverImg ? offer.listedItem.lp.title : defaultCoverImg} />
        </Grid>
        <Grid container direction="column" item xs >
            <Grid item xs zeroMinWidth>
                <Typography variant="body1" gutterBottom >{t('receivedOffers.buyingOfferFor', { username: offer.buyer.username, price: offer.suggestedPrice })}</Typography>
            </Grid>
            <Grid item xs zeroMinWidth>
                {offer.status === 'pending' ?
                    <>
                        <Button size="small" color="primary" variant="outlined" disabled={loading} >
                            {t('receivedOffers.accept')}
                        </Button>
                        <Button size="small" color="secondary" variant="outlined" disabled={loading} style={{ marginLeft: '8px' }} >
                            {t('receivedOffers.reject')}
                        </Button>
                    </>
                    :
                    <Typography variant="body1" color={offer.status === 'accepted' ? 'primary' : 'textSecondary'}
                        gutterBottom >{t(`offer.status.${offer.status}`)}</Typography>
                }
            </Grid>
        </Grid>
    </Grid> */

}

export default SendedOffer

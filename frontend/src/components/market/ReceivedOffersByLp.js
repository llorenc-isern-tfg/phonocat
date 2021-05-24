import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { useTranslation } from "react-i18next"
import Collapse from '@material-ui/core/Collapse'
import List from '@material-ui/core/List'
import Grid from '@material-ui/core/Grid'
import Badge from '@material-ui/core/Badge'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Rating from '@material-ui/lab/Rating'
import { useDispatch } from 'react-redux'

import defaultCoverImg from '../../images/lp_cover_default.png'
import { Divider } from '@material-ui/core'
import { rejectOfferRequest, acceptOfferRequest, rateOfferRequest } from '../../actions/marketActions'
import ButtonSpinner from '../shared/ButtonSpinner'


const useStyles = makeStyles((theme) => ({
    nested: {
        paddingLeft: theme.spacing(5),
    },
    smallAvatar: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
    rateButton: {
        marginTop: -theme.spacing(2)
    }
}))

const ReceivedOffersByLp = ({ lpOffers }) => {

    const dispatch = useDispatch()

    const classes = useStyles()
    const { listedItem, offers } = lpOffers
    const { lp } = listedItem
    const [open, setOpen] = useState(lpOffers.offers.filter(off => off.status === 'accepted').length > 0)

    const [score, setScore] = useState(0)

    const { t } = useTranslation(['translation', 'country'])

    const handleExpand = () => setOpen(!open)

    const handleAccept = offer => dispatch(acceptOfferRequest(offer))

    const handleReject = offer => dispatch(rejectOfferRequest(offer))

    const handleRate = offer => dispatch(rateOfferRequest(offer, score, 'seller'))
    return (
        <React.Fragment >
            <Divider />
            <ListItem alignItems="flex-start" key={lpOffers.listedItem._id} button onClick={handleExpand}>
                <ListItemIcon>
                    <Badge color="primary" badgeContent={offers.filter(off => off.status === 'pending').length}>
                        <Avatar src={lp.coverImg ? lp.coverImg : defaultCoverImg}
                            variant="rounded"
                            style={{ margin: 'auto' }} />
                    </Badge>
                </ListItemIcon>
                <ListItemText primary={lp.title} secondary={t('receivedOffers.listedFor', { price: listedItem.wantedPrice })} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem >
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {offers.map((offer) => (
                        offer.status !== 'rejected' &&
                        <React.Fragment key={offer._id}>
                            {/* <Divider variant="inset" /> */}
                            <ListItem className={classes.nested}>
                                <Grid container wrap="nowrap" spacing={2}>
                                    <Grid item>
                                        <Avatar className={classes.smallAvatar} alt={offer.buyer.username} src={offer.buyer.picture} />
                                    </Grid>
                                    <Grid container direction="column" item xs >
                                        <Grid item xs zeroMinWidth>
                                            <Typography variant="body1" gutterBottom >{t('receivedOffers.buyingOfferFor', { username: offer.buyer.username, price: offer.suggestedPrice })}</Typography>
                                        </Grid>
                                        <Grid item xs zeroMinWidth>
                                            {offer.status === 'pending' &&
                                                <>
                                                    <Button size="small" color="primary" variant="outlined" disabled={offer.disabled}
                                                        onClick={() => handleAccept(offer)} >
                                                        {offer.accepting && <ButtonSpinner />}
                                                        {t('receivedOffers.accept')}
                                                    </Button>
                                                    <Button size="small" color="secondary" variant="outlined" disabled={offer.disabled}
                                                        onClick={() => handleReject(offer)}
                                                        style={{ marginLeft: '8px' }} >
                                                        {offer.rejecting && <ButtonSpinner />}
                                                        {t('receivedOffers.reject')}
                                                    </Button>
                                                </>
                                            }
                                            {offer.status === 'accepted' &&
                                                <React.Fragment>
                                                    <Typography variant="body1" color="primary" >
                                                        {t(`offer.status.${offer.status}`)}</Typography>
                                                    {!offer.sellerReview && <Typography variant="body2" color="textSecondary" gutterBottom >
                                                        {t('offer.rate')}&nbsp;&nbsp;
                                                    </Typography>}
                                                    <Rating
                                                        readOnly={offer.sellerReview ? true : false}
                                                        id={"rating_" + offer._id}
                                                        name={"rating_" + offer._id}
                                                        value={offer.sellerReview ? offer.sellerReview.rating : score}
                                                        onChange={(event, value) => {
                                                            setScore(value)
                                                        }}
                                                    />
                                                    {!offer.sellerReview && <Button size="small" color="primary" disabled={offer.rating}
                                                        onClick={() => handleRate(offer)}
                                                        className={classes.rateButton} >
                                                        {t('offer.rateButton')}
                                                    </Button>}
                                                </React.Fragment>
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        </React.Fragment>
                    ))}
                </List>
            </Collapse>
        </React.Fragment>
    )
}

export default ReceivedOffersByLp

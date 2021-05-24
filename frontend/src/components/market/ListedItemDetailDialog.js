import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import { useTranslation } from "react-i18next"
import Card from '@material-ui/core/Card'
import Avatar from '@material-ui/core/Avatar'
import PlaceIcon from '@material-ui/icons/Place'
import { makeStyles } from '@material-ui/core/styles'
import Image from 'material-ui-image'
import ConditionIcon from '../../components/lps/ConditionIcon'
import UnknownIcon from '@material-ui/icons/HelpOutline'
import SpeakerIcon from '@material-ui/icons/Speaker'
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera'
import GavelIcon from '@material-ui/icons/Gavel'
import SpeakerGroupIcon from '@material-ui/icons/SpeakerGroup'
import * as yup from 'yup'
import { setLocale } from 'yup'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import defaultCoverImg from '../../images/lp_cover_default.png'
import DialogTitleWithClose from '../shared/DialogTitleWithClose'
import ButtonSpinner from '../shared/ButtonSpinner'
import NumberFormatCustom from '../shared/NumberFormatCustom'
import yupMessages from '../../locales/yupMessages'
import { makeOfferRequest } from '../../actions/marketActions'

const useStyles = makeStyles((theme) => ({
    divider: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    offerBox: {
        width: '100%',
        padding: theme.spacing(2),
        backgroundColor: theme.palette.primary[50],
    },
    ownerAvatar: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        marginLeft: theme.spacing(2)
    },
    bottomSeparation: {
        marginBottom: theme.spacing(2)
    }
}))

const ListedItemDetailDialog = ({ dialogProps }) => {

    const { open, listedItem, handleClose } = dialogProps
    const { lp } = listedItem
    const { owner } = lp

    const dispatch = useDispatch()

    const listedItemOffer = useSelector((state) => state.listedItemOffer)
    const { loading, offer } = listedItemOffer
    const [userOffer, setUserOffer] = useState()

    const auth = useSelector((state) => state.auth)
    const { userInfo } = auth

    const [ammount, setAmmount] = useState()
    const [ammountError, setAmmountError] = useState()

    const getExistingUserOffer = () => listedItem.offers.find((of) => of.buyer === userInfo.id)

    useEffect(() => {
        if (offer && offer.listedItem === listedItem._id) {
            listedItem.offers.unshift(offer)
            setUserOffer(offer)
        } else {
            setUserOffer(getExistingUserOffer())
        }
    }, [offer])

    const userOwnsLp = () => {
        return owner.username === userInfo.username
    }

    setLocale(yupMessages)
    const makeOfferSchema = yup.object().shape({
        suggestedPrice: yup.string().required()
    })

    const handleChangeAmmount = (event) => {
        setAmmount(event.target.value)
    }

    const handleMakeOffer = async () => {
        try {
            await makeOfferSchema.validate({ suggestedPrice: ammount })
            dispatch(
                makeOfferRequest(listedItem._id, { suggestedPrice: ammount })
            )
        } catch (err) {
            setAmmountError(err.message)
            return
        }
    }

    const { t } = useTranslation()

    const classes = useStyles()

    return (
        <Dialog
            fullWidth={true}
            maxWidth="lg"
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitleWithClose title={lp.title} subtitle={lp.artist.name}
                onClose={handleClose} />
            {/* <DialogTitle id="alert-dialog-title" disableTypography>
                <Typography variant="h5" align="center">{lp.title}</Typography>
                <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="subtitle1" color="textSecondary" align="center" gutterBottom>
                    {lp.artist.name}
                </Typography>
            </DialogTitle> */}
            <DialogContent dividers>
                <Grid container spacing={3} style={{ marginBottom: 5 }}>
                    <Grid item xs={12} sm={3}  >
                        <Card className={classes.coverCard} elevation={4}>
                            <Image src={lp.coverImg ? lp.coverImg : defaultCoverImg} />
                        </Card>
                    </Grid>
                    <Grid container spacing={2} item xs={12} sm={3}>
                        <Paper elevation={0} className={classes.lpInfo}>
                            <Grid item xs={12} >
                                <Typography variant="subtitle1" color="textSecondary">{t('lpDetail.genre')}</Typography>
                                <Typography variant="subtitle2" >{t(`select:musicGenre.${lp.genre}`)}</Typography>
                            </Grid>
                            <Grid item xs={12} >
                                <Typography variant="subtitle1" color="textSecondary">{t('listedItemDetail.condition')}</Typography>
                                {lp.condition ?
                                    <Typography variant="subtitle2" ><ConditionIcon condition={lp.condition} /> {t(`select:albumCondition.${lp.condition}`)}</Typography>
                                    :
                                    <Typography variant="subtitle2" ><UnknownIcon fontSize="small" className={classes.labelIcon} /> {t('listedItemDetail.unknown', { context: 'female' })}</Typography>
                                }
                            </Grid>
                            <Grid item xs={12} >
                                <Typography variant="subtitle1" color="textSecondary">{t('lpDetail.weight')}</Typography>
                                {lp.weight ?
                                    <Typography variant="subtitle2" >{t(`select:albumWeight.${lp.weight}`)}</Typography>
                                    :
                                    <Typography variant="subtitle2" ><UnknownIcon fontSize="small" className={classes.labelIcon} /> {t('listedItemDetail.unknown', { context: 'female' })}</Typography>
                                }
                            </Grid>
                            {lp.numDiscs &&
                                <Grid item xs={12} >
                                    <Typography variant="subtitle1" color="textSecondary">{t('lpDetail.numDiscs')}</Typography>
                                    <Typography variant="subtitle2" >{lp.numDiscs}</Typography>
                                </Grid>
                            }
                            {lp.channel &&
                                <Grid item xs={12} >
                                    <Typography variant="subtitle1" color="textSecondary">{t('lpDetail.channel')}</Typography>
                                    <Typography variant="subtitle2" >
                                        {lp.channel === 'stereo' ?
                                            <SpeakerGroupIcon fontSize="small" className={classes.labelIcon} />
                                            :
                                            <SpeakerIcon fontSize="small" className={classes.labelIcon} />
                                        }
                                        {lp.channel}
                                    </Typography>
                                </Grid>
                            }
                        </Paper>
                    </Grid>
                    <Grid container spacing={2} item xs={12} sm={6} direction="column">
                        <Grid container item wrap="nowrap" >
                            <Grid item xs zeroMinWidth>
                                <Typography variant="body1" align="right" >{t('listedItemDetail.publishedBy', { name: owner.username })}</Typography>
                                {owner.country && <Typography variant="body2" align="right" >{t(`country:${owner.country}`)}<PlaceIcon size="small" color="disabled" /></Typography>}
                            </Grid>
                            <Grid item>
                                <Avatar alt={owner.username} src={owner.picture} className={classes.ownerAvatar} />
                            </Grid>
                        </Grid>
                        <Grid container item >
                            <Paper elevation={0} className={classes.offerBox}>

                                {userOwnsLp() ?
                                    <>
                                        <Typography variant="subtitle2" gutterBottom>{t('session.welcome', { username: userInfo.username })}</Typography>
                                        <Typography variant="subtitle2" gutterBottom>{t('listedItemDetail.nOffers_interval', { postProcess: 'interval', count: listedItem.offers.length })}</Typography>
                                        <Button
                                            component={Link}
                                            to="/offers"
                                            color="primary"
                                            onClick={handleMakeOffer}
                                            disabled={loading}
                                        >
                                            {loading && <ButtonSpinner />}
                                            {t('listedItemDetail.seeOffers')}
                                        </Button>
                                    </>
                                    :
                                    userOffer ?
                                        <>
                                            <Typography variant="subtitle2" gutterBottom>{t('listedItemDetail.offerMade', { ammount: userOffer.suggestedPrice })}</Typography>
                                        </>
                                        :
                                        <>
                                            <Typography variant="caption" gutterBottom>{t('listedItemDetail.nOffers_interval', { postProcess: 'interval', count: listedItem.offers.length })}</Typography>
                                            <Grid item xs={12} className={classes.bottomSeparation}>
                                                <Typography className={classes.bottomSeparation}>
                                                    {t('listedItemDetail.makeOffer1')} <strong>{listedItem.wantedPrice} €</strong>, {t('listedItemDetail.makeOffer2')}
                                                </Typography>
                                                {lp.listedItem ?
                                                    null
                                                    :
                                                    <TextField
                                                        variant="outlined"
                                                        required
                                                        style={{
                                                            backgroundColor: 'white'
                                                        }}
                                                        label={t('listedItemDetail.offerLabel')}
                                                        value={ammount}
                                                        fullWidth
                                                        onChange={handleChangeAmmount}
                                                        name="ammount"
                                                        id="ammount"
                                                        InputProps={{
                                                            inputComponent: NumberFormatCustom,
                                                        }}
                                                        error={ammountError ? true : false}
                                                        helperText={ammountError}
                                                    />
                                                }
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button
                                                    startIcon={<GavelIcon />}
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleMakeOffer}
                                                    disabled={loading}
                                                >
                                                    {loading && <ButtonSpinner />}
                                                    {t('listedItemDetail.sendOffer')}
                                                </Button>
                                            </Grid>
                                        </>
                                }
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
                {listedItem.pictures.length > 0 &&
                    <React.Fragment>
                        <Divider className={classes.divider} />
                        <Grid item xs={12} container spacing={1} >
                            {listedItem.pictures.length > 0 && <Grid item xs={12}>
                                <Typography variant="body2"> <PhotoCameraIcon fontSize="small" color="disabled" className={classes.labelIcon} />{t('listedItemDetail.pictures')}</Typography>
                            </Grid>}
                            {
                                listedItem.pictures.map((picture, i) =>
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={`picture_${i}`}>
                                        <Image src={picture} />
                                    </Grid>
                                )
                            }
                        </Grid>
                    </React.Fragment>
                }

                {/* {lp.isPublic ?
                        <Grid item xs={12}>
                            <Paper elevation={0} className={classes.sellLpBox}>
                                <Typography variant="h6" gutterBottom>
                                    {lp.listedItem ?
                                        <React.Fragment>
                                            {t('lpDetail.sell.forSale')}
                                            <NumberFormat
                                                value={lp.listedItem.wantedPrice} displayType={'text'}
                                                thousandSeparator={i18n.t('currency.thousandSeparator')}
                                                decimalSeparator={i18n.t('currency.decimalSeparator')}
                                                decimalScale={2}
                                                fixedDecimalScale
                                                suffix="€"
                                            />
                                        </React.Fragment>
                                        :
                                        t('lpDetail.sell.title')}
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        {lp.listedItem ?
                                            null
                                            :
                                            <TextField
                                                variant="outlined"
                                                required
                                                style={{
                                                    backgroundColor: 'white'
                                                }}
                                                label={t('lpDetail.sell.priceInput')}
                                                value={ammount}
                                                fullWidth
                                                onChange={handleChangeAmmount}
                                                name="ammount"
                                                id="ammount"
                                                InputProps={{
                                                    inputComponent: NumberFormatCustom,
                                                }}
                                                error={ammountError ? true : false}
                                                helperText={ammountError}
                                            />
                                        }
                                    </Grid>
                                    {lp.listedItem ?
                                        <Grid item xs={12} container spacing={1}>
                                            {lp.listedItem.pictures.length > 0 && <Grid item xs={12}>
                                                <Typography variant="body2">Imatges de l'anunci</Typography>
                                            </Grid>}
                                            {
                                                lp.listedItem.pictures.map((picture, i) =>
                                                    <Grid item xs={6} sm={6} md={4} lg={3} key={`picture_${i}`}>
                                                        <Image src={picture} />
                                                    </Grid>
                                                )
                                            }
                                        </Grid>
                                        :
                                        <Grid item xs={12}>
                                            <DropImage label={t('lpDetail.sell.uploadPictures')} maxFiles={4} onDropHandle={handleOnDropPictures} />
                                        </Grid>
                                    }
                                    <Grid item xs={12}>
                                        {lp.listedItem ?
                                            <Button
                                                startIcon={<UnpublishIcon />}
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => setOpenUnlistDialog(true)}
                                                disabled={listsForSale && listsForSale.loading}
                                            >
                                                {t('lpDetail.sell.unpublish')}
                                            </Button>
                                            :
                                            <Button
                                                startIcon={<PublishIcon />}
                                                variant="contained"
                                                color="primary"
                                                onClick={handlePublish}
                                                disabled={listsForSale && listsForSale.loading}
                                            >
                                                {listsForSale && listsForSale.loading && <ButtonSpinner />}
                                                {t('lpDetail.sell.publish')}
                                            </Button>
                                        }
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        :
                        <Grid item xs={12}>
                            <Typography variant="body2">
                                <InfoIcon fontSize="small" className={classes.labelIcon} />{t('lpDetail.changeVisibilityForSell')}
                            </Typography>
                        </Grid>
                    } */}
            </DialogContent>
        </Dialog >
    )
}

export default ListedItemDetailDialog

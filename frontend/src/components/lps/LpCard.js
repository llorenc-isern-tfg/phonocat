import React from 'react'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardMedia from '@material-ui/core/CardMedia'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardHeader from '@material-ui/core/CardHeader'
import Badge from '@material-ui/core/Badge'
import IconButton from '@material-ui/core/IconButton'
import OfferIcon from '@material-ui/icons/LocalOffer'
import PublicIcon from '@material-ui/icons/Visibility'
import PrivateIcon from '@material-ui/icons/VisibilityOff'
import { useTranslation } from "react-i18next"
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import Image from 'material-ui-image'

import defaultCoverImg from '../../images/lp_cover_default.png'
import { Tooltip } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    headerActionArea: {
        flexGrow: 1,
    },
    media: {
        paddingTop: '75%',
        backgroundColor: theme.palette.primary[200]
    },
    cartButtons: {
        flexGrow: 1
    },
    avatar: {
        width: theme.spacing(5),
        height: theme.spacing(5),
    },
    headerRoot: {
        display: 'block'
    },
    headerAction: {
        alignSelf: 'auto',
        textAlign: 'right'
    }
}));

const truncateText = (text, limit = 25) => {

}

const LpCard = ({ lp, onDelete }) => {

    const { t } = useTranslation()

    const classes = useStyles()

    const tooltipMsg = ''// t(lp.isPublic ? 'lpCollection.public' : 'lpCollection.private')

    return (
        <Card className={classes.card}>
            {/* <Tooltip title={tooltipMsg} aria-label={tooltipMsg} placement="top" arrow> */}
            <CardActionArea component={Link} to={`/lp/collection/${lp._id}`}>
                <CardHeader classes={{
                    root: classes.headerRoot,
                    action: classes.headerAction
                }}
                    action={
                        lp.isPublic ? <PublicIcon color="disabled" /> : <PrivateIcon color="disabled" />
                    }
                    title={lp.title}
                    titleTypographyProps={{ variant: 'h6', display: 'block', noWrap: true }}

                    subheader={lp.artist}
                    subheaderTypographyProps={{ display: 'block', noWrap: true }}
                />
                {/* <Image draggable="false" src={lp.coverImg ? lp.coverImg : defaultCoverImg} /> */}
                <CardMedia
                    className={classes.media}
                    src={lp.coverImg}
                    image={lp.coverImg ? lp.coverImg : defaultCoverImg}
                    title={lp.title + ' cover'}
                />
            </CardActionArea >
            {/* </Tooltip> */}
            <CardActions className={classes.cartButtons}>
                <Button component={Link} to={`/lp/collection/${lp._id}/edit`}
                    size="small" color="primary" variant="outlined" >
                    {t('form.edit')}
                </Button>
                <Button
                    size="small" color="secondary" variant="outlined" onClick={() => onDelete(lp)}>
                    {t('form.delete')}
                </Button>
                {lp.isForSale &&
                    <IconButton size="small" color="primary" style={{ marginLeft: 'auto' }}>
                        <Badge color="secondary" badgeContent={lp.numReceivedOffers}>
                            <OfferIcon />
                        </Badge>
                    </IconButton>
                }
            </CardActions>
        </Card >
    )
}

export default LpCard

import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import AlbumIcon from '@material-ui/icons/Album'
import OfferIcon from '@material-ui/icons/LocalOffer'
import PublicIcon from '@material-ui/icons/Visibility'
import PrivateIcon from '@material-ui/icons/VisibilityOff'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import { useTranslation } from "react-i18next"
import { makeStyles } from '@material-ui/core/styles';

import defaultCoverImg from '../../images/lp_cover_default.png'

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

const LpCard = ({ lp, onEdit, onDelete }) => {

    const { t } = useTranslation()

    const classes = useStyles()

    const tooltipMsg = ''// t(lp.isPublic ? 'lpCollection.public' : 'lpCollection.private')

    return (
        <Card className={classes.card}>
            {/* <Tooltip title={tooltipMsg} aria-label={tooltipMsg} placement="top" arrow> */}
            <CardActionArea>
                {/* <CardActionArea className={classes.headerActionArea}> */}
                <CardHeader classes={{
                    root: classes.headerRoot,
                    action: classes.headerAction
                }}
                    // avatar={
                    //     <Avatar aria-label="recipe">
                    //         <AlbumIcon />
                    //     </Avatar>
                    // }
                    action={
                        lp.isPublic ? <PublicIcon color="disabled" /> : <PrivateIcon color="disabled" />
                    }
                    title={lp.title}
                    titleTypographyProps={{ variant: 'h6', display: 'block', noWrap: true }}

                    subheader={lp.artist}
                    subheaderTypographyProps={{ display: 'block', noWrap: true }}
                />
                {/* </CardActionArea> */}
                {/* <CardActionArea> */}
                <CardMedia
                    // component="img"
                    className={classes.media}
                    image={lp.coverImg ? lp.coverImg : defaultCoverImg}
                    title={lp.title + ' cover'}
                />
                {/* </CardActionArea> */}
            </CardActionArea >
            {/* </Tooltip> */}
            <CardActions className={classes.cartButtons}>
                {/* <Fab size="small" color="primary" >
                    <EditIcon className={classes.extendedIcon} />
                </Fab>
                <Fab size="small" color="secondary" className={classes.actionButton} >
                    <DeleteIcon className={classes.extendedIcon} />
                </Fab> */}
                <Button
                    size="small" color="primary" variant="outlined" onClick={() => onEdit(lp)}>
                    {t('form.edit')}
                </Button>
                <Button
                    size="small" color="secondary" variant="outlined" onClick={() => onDelete(lp)}>
                    {t('form.delete')}
                </Button>
                {lp.isPublic /*lp.forSale*/ &&
                    <IconButton size="small" color="primary" style={{ marginLeft: 'auto' }}>
                        <Badge color="secondary" badgeContent={1 /*lp.numReceivedOffers*/}>
                            <OfferIcon />
                        </Badge>
                    </IconButton>
                }
            </CardActions>
        </Card >
    )
}

export default LpCard

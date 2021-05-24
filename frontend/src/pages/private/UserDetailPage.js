import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Backdrop from '@material-ui/core/Backdrop'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Button from '@material-ui/core/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled'
import PlaceIcon from '@material-ui/icons/Place'
import AlbumIcon from '@material-ui/icons/Album'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import Avatar from '@material-ui/core/Avatar'
import AvatarGroup from '@material-ui/lab/AvatarGroup'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth'

import { getUserDetailRequest, userDetailClear, followUserRequest, unfollowUserRequest } from '../../actions/socialActions'
import ButtonSpinner from '../../components/shared/ButtonSpinner'
import defaultCoverImg from '../../images/lp_cover_default.png'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(15),
        marginBottom: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: theme.spacing(3)
    },
    avatar: {
        color: theme.palette.getContrastText(theme.palette.secondary[500]),
        backgroundColor: theme.palette.secondary[500],
        boxShadow: theme.shadows[4],
        margin: '0 auto',
        width: theme.spacing(20),
        height: theme.spacing(20),
        transform: 'translate3d(0,-50%,0)'
    },
    username: {
        marginTop: -theme.spacing(8),
    },
    wrapper: {
        margin: 0,
        position: 'relative',
    },
    follow: {
        position: 'absolute',
        top: 0,
        right: 0,
        marginTop: '-23px'
    },
    followers: {
        marginBottom: theme.spacing(3)
    },
    accordionSummary: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
    },
    accordionDetail: {
        display: 'block',
        backgroundColor: theme.palette.primary[50],
    },
    heading: {
        fontSize: theme.typography.pxToRem(17),
        fontWeight: theme.typography.fontWeightMedium,
    },
    gridList: {
        // minWidth: '150px',
        [theme.breakpoints.down('sm')]: {
            maxHeight: 400,
        },
        [theme.breakpoints.up('md')]: {
            maxHeight: 600,
        },
        [theme.breakpoints.up('lg')]: {
            maxHeight: 600,
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
}))

const UserDetailPage = (props) => {

    const { match } = props
    const username = match.params.username

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getUserDetailRequest(username))
        return () => dispatch(userDetailClear())
    }, [])

    const userDetail = useSelector((state) => state.userDetail)
    const { status, followingStatus, user } = userDetail
    const [following, setFollowing] = useState(false)

    const auth = useSelector((state) => state.auth)
    const { userInfo } = auth

    const isLoggedUser = username === userInfo.username

    useEffect(() => {
        const isFollowing = user && user.followers.find(follower => follower.username === userInfo.username)
        setFollowing(isFollowing)
    }, [user])

    const { t } = useTranslation()
    const classes = useStyles()

    const handleFollow = () => {
        dispatch(followUserRequest(username))
    }

    const handleUnfollow = () => {
        dispatch(unfollowUserRequest(username))
    }

    const getGridCols = () => {
        let cols = 1
        if (isWidthUp('sm', props.width)) {
            cols = 2
        }
        if (isWidthUp('md', props.width)) {
            cols = 3
        }
        if (isWidthUp('lg', props.width)) {
            cols = 4
        }
        return cols
    }

    return (
        <React.Fragment>
            {user &&
                <Container maxWidth="lg">
                    <Paper className={classes.paper} elevation={2} >
                        <Container maxWidth="md">
                            <div className={classes.wrapper}>
                                <Avatar className={classes.avatar}
                                    alt={user.username.toUpperCase()} src={user.picture}>
                                    <Typography variant="h1">{user.username.charAt(0).toUpperCase()}</Typography>
                                </Avatar>
                                <Box className={classes.username}>
                                    <Typography
                                        component="h1" variant="h5" align="center"
                                        gutterBottom
                                        color="textPrimary">
                                        {user.username}
                                    </Typography>
                                    {user.country &&
                                        <Typography
                                            variant="subtitle1"
                                            color="textSecondary"
                                            align="center">
                                            <PlaceIcon color="disabled" />{t(`country:${user.country}`)}
                                        </Typography>
                                    }
                                    <Typography
                                        variant="subtitle1" align="center"
                                        color="textPrimary" gutterBottom>
                                        {user.bio}
                                    </Typography>
                                </Box>
                                {user.followers.length > 0 &&
                                    <Grid
                                        container
                                        spacing={1}
                                        direction="column"
                                        alignItems="center"
                                        justify="center"
                                        className={classes.followers}
                                    >
                                        <Grid item xs={false}  >
                                            <Typography variant="caption" color="textSecondary">{t('userDetail.usersFollowing', { count: user.followers.length, username: user.username })}</Typography>
                                        </Grid>
                                        <Grid item xs={false} >
                                            <AvatarGroup max={5}>
                                                {user.followers.map(follower =>
                                                    <Avatar key={follower.username} alt={follower.username} src={follower.picture} />
                                                )}
                                            </AvatarGroup>
                                        </Grid>

                                    </Grid>
                                }
                                {!isLoggedUser &&
                                    <Box className={classes.follow}>
                                        {following ?
                                            <Tooltip title={t('userDetail.unfollow')}
                                                placement="top" arrow>
                                                <Fab color="secondary" disabled={followingStatus && followingStatus.loading} onClick={handleUnfollow}>
                                                    {followingStatus && followingStatus.loading && <ButtonSpinner />}
                                                    <PersonAddDisabledIcon />
                                                </Fab>
                                            </Tooltip>
                                            :
                                            <Tooltip title={t('userDetail.follow')}
                                                placement="top" arrow>
                                                <Fab color="primary" disabled={followingStatus && followingStatus.loading} onClick={handleFollow}>
                                                    {followingStatus && followingStatus.loading && <ButtonSpinner />}
                                                    <PersonAddIcon />
                                                </Fab>
                                            </Tooltip>
                                        }
                                    </Box>
                                }
                            </div>
                        </Container>
                        <Container maxWidth="lg" className={classes.gridContainer}>
                            {user.ownedLps.length > 0 ?
                                <Accordion defaultExpanded>
                                    <AccordionSummary
                                        className={classes.accordionSummary}
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-label="Expand"
                                        aria-controls="additional-actions1-content"
                                        id="additional-actions1-header"
                                    >
                                        <AlbumIcon color="primary" />
                                        <Typography color="primary" className={classes.heading} align="center" variant="subtitle2">
                                            &nbsp;{t('userDetail.collection')}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails className={classes.accordionDetail}>
                                        <GridList className={classes.gridList} cols={getGridCols()}>
                                            {user.ownedLps.map((lp) => (
                                                <GridListTile key={lp._id}>
                                                    <img src={lp.coverImg ? lp.coverImg : defaultCoverImg} alt={lp.title} />
                                                    <GridListTileBar
                                                        title={lp.title}
                                                        subtitle={lp.artist}
                                                    />
                                                </GridListTile>
                                            ))}
                                        </GridList>
                                    </AccordionDetails>
                                </Accordion>
                                :
                                <Typography
                                    variant="body2" align="center"
                                    color="textSecondary">
                                    <AlbumIcon color="disabled" fontSize="small" />&nbsp;{t('userDetail.emptyCollection')}
                                </Typography>
                            }
                        </Container>
                        <Container maxWidth="lg">
                            <Box component="div" className={classes.buttons}>
                                <Button variant="contained" color="primary" className={classes.button}
                                    component={Link} to="/users/">
                                    {t('form.exit')}
                                </Button>
                            </Box>
                        </Container>
                    </Paper>

                    {/* <Backdrop className={classes.backdrop} open={(status && status.loading) ? status.loading : false}>
                    <CircularProgress color="inherit" />
                </Backdrop> */}
                </Container>
            }
        </React.Fragment >
    )
}

export default withWidth()(UserDetailPage)

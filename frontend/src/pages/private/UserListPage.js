import React, { useState, useEffect, useRef } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroll-component'
import Chip from '@material-ui/core/Chip'
import { createSelector } from 'reselect'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Badge from '@material-ui/core/Badge'
import Avatar from '@material-ui/core/Avatar'
import Paper from '@material-ui/core/Paper'
import Skeleton from '@material-ui/lab/Skeleton'
import PlaceIcon from '@material-ui/icons/Place'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import _ from 'lodash'


import { userListRequest, userListClear } from '../../actions/socialActions'
import { truncateString } from '../../utils/utils'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: 0
    },
    root: {
        width: '100%',
        maxWidth: '600ch',
        backgroundColor: theme.palette.background.paper,
    },
    lpChip: {
        margin: '2px',
        display: 'inline-block'
    }
}))

//Creem el selector fora del component amb reselect per evitar problemes de re-render deguts a l'scroll infinit
const selectUserList = createSelector(
    state => state.userList,
    userList => userList
)

const StyledBadge = withStyles((theme) => ({
    badge: {
        // backgroundColor: theme.palette.grey[200]
        color: theme.palette.grey[500]
    },
}))(Badge);

const UserListPage = () => {

    const { t } = useTranslation(['translation', 'country'])

    const dispatch = useDispatch()

    const classes = useStyles()

    const { users, pagination } = useSelector(selectUserList)

    //Quan es renderitza el component per primera vegada, carreguem el llistat de lps
    useEffect(() => {
        loadMore()
        //netejem el llistat al sortir de la pàgina
        return () => dispatch(userListClear())
    }, [])

    const [scrollableUsers, setScrollableUsers] = useState([])

    useEffect(() => {
        if (users)
            setScrollableUsers(users)
    }, [users])

    const loadMore = () => {
        dispatch(userListRequest(
            {
                page: pagination ? pagination.page : 0,
                limit: 25
            }
        ))
    }

    const renderUser = (user) => {
        let expandUser = false
        return (
            <ListItem alignItems="flex-start" key={user._id} button divider
                component={Link} to={`/users/${user.username}`}>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                        <Avatar alt={user.username} src={user.picture} style={{ margin: 'auto' }} />
                    </Grid>
                    <Grid container direction="column" item xs zeroMinWidth>
                        <Grid item xs zeroMinWidth>
                            <Typography variant="body1" noWrap>{user.username}</Typography>
                        </Grid>
                        <Grid item xs zeroMinWidth>
                            <Typography variant="body2" color="textSecondary" noWrap gutterBottom>{user.bio}</Typography>
                        </Grid>
                        {user.latestLps.length > 0 &&
                            <Grid item>
                                <Typography variant="caption" color="textSecondary"> {t('userList.latestLps')}</Typography>
                                {user.latestLps.map((lp) => (
                                    <span key={lp._id} className={classes.lpChip}>&nbsp;
                                        <Chip color="default" size="small"
                                            avatar={lp.coverImg ? <Avatar src={lp.coverImg} /> : undefined}
                                            label={truncateString(lp.title, 20)}
                                            className={classes.chip}
                                        />
                                    </span>
                                ))}
                                {user.latestLps.length < user.numLps ?
                                    <span key="moreLps" className={classes.lpChip}>
                                        <StyledBadge badgeContent={`+${user.numLps - 5}`} >
                                            <MoreHorizIcon color="disabled" fontSize="small" />
                                        </StyledBadge>
                                    </span>
                                    :
                                    null
                                }
                            </Grid>
                        }
                        {user.country &&
                            <Grid item xs zeroMinWidth>
                                <Typography variant="body2" color="textSecondary" noWrap><PlaceIcon fontSize="small" color="disabled" />{t(`country:${user.country}`)}</Typography>
                            </Grid>
                        }
                    </Grid>
                </Grid>
            </ListItem >
        )
    }

    const renderLoadingUsers = (i) => {
        return (
            <ListItem alignItems="flex-start" key={`loading_users_${i}`} divider >
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                        <Skeleton animation="wave" variant="circle" width={40} height={40} />
                    </Grid>
                    <Grid container direction="column" item xs zeroMinWidth>
                        <Skeleton animation="wave" height={10} width="90%" style={{ marginBottom: 6 }} />
                        <Skeleton animation="wave" height={10} width="40%" style={{ marginBottom: 6 }} />
                        <Typography variant="body2" color="textSecondary" noWrap gutterBottom>{t('userList.loading')}</Typography>
                    </Grid>
                </Grid>
            </ListItem >
        )
    }

    return (
        // <div style={{ height: "100%", overflow: "auto", backgroundColor: "blue" }} id="userList" ref={scrollerRef}>
        <Container maxWidth="xl">
            <Paper className={classes.paper}>
                <List className={classes.root}>
                    <InfiniteScroll
                        dataLength={scrollableUsers.length} //This is important field to render the next data
                        next={loadMore}
                        hasMore={scrollableUsers && pagination && pagination.hasNextPage}
                        loader={_.times(25, (i) => renderLoadingUsers(i))}
                        // endMessage={
                        //     <Typography>S'han carregat tots els usuaris</Typography>
                        // }
                        scrollableTarget="userList"
                    >
                        {scrollableUsers.map((user, index) => renderUser(user))}
                    </InfiniteScroll>
                </List>

            </Paper>
            {/* <Backdrop className={classes.backdrop} open={(status && status.loading) ? status.loading : false}>
                    <CircularProgress color="inherit" />
                </Backdrop> */}
        </Container>
    )
}

export default UserListPage


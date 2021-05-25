import React, { useState, useEffect } from 'react'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import Divider from '@material-ui/core/Divider'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import AlbumIcon from '@material-ui/icons/Album'
import AddBoxIcon from '@material-ui/icons/AddBox'
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket'
import GroupIcon from '@material-ui/icons/Group'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import { useTranslation } from "react-i18next"
import { Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'

const drawerWidth = 240


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(4),
    },
    sectionTitle: {
        marginLeft: theme.spacing(3),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(3),
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: "hidden",
        width: theme.spacing(5) + 40,
        [theme.breakpoints.down("xs")]: {
            width: drawerWidth,
        },
    },
}));

const sideMenu = [
    {

        header: undefined,
        menuItems: [
            {
                id: 'profile',
                to: '/profile',
                icon: <AccountCircleIcon />,
                textKey: 'sideMenu.profile',
            }
        ]

    },
    {
        header: 'sideMenu.lps',
        menuItems: [
            {
                id: 'lpCollection',
                to: '/lp/collection',
                icon: <AlbumIcon />,
                textKey: 'sideMenu.lpCollection'
            },
            {
                id: 'lpAdd',
                to: '/lp/new',
                icon: <AddBoxIcon />,
                textKey: 'sideMenu.lpAdd'
            },

        ]
    },
    {
        header: 'sideMenu.market',
        menuItems: [
            {
                id: 'listedItems',
                to: '/listedItems',
                icon: <ShoppingBasketIcon />,
                textKey: 'sideMenu.listedItems'
            },
            {
                id: 'offers',
                to: '/myOffers',
                icon: <LocalOfferIcon />,
                textKey: 'sideMenu.offers'
            },

        ]
    },
    {
        header: 'sideMenu.social',
        menuItems: [
            {
                id: 'users',
                to: '/users',
                icon: <GroupIcon />,
                textKey: 'sideMenu.users'
            },
        ]
    }
]

let flatMenuItems = []
sideMenu.forEach((section) => {
    flatMenuItems = flatMenuItems.concat(
        section.menuItems
    )
})

const SideMenu = ({ handleDrawerOpen, handleDrawerClose, openDrawer }) => {

    const { t } = useTranslation();

    const classes = useStyles()
    const theme = useTheme()

    const auth = useSelector((state) => state.auth)
    const { userInfo } = auth

    const location = useLocation()

    const [selected, setSelected] = useState('')

    const findSelected = () => {

        return flatMenuItems.find(({ to }) => (location.pathname === to || location.pathname.indexOf(to) !== -1))
    }

    useEffect(() => {
        setSelected(findSelected() ? findSelected().id : '')
    }, [location])

    const renderDrawer = () => {
        return (
            <React.Fragment>
                {
                    sideMenu.map((section, i) => {
                        return (
                            <React.Fragment key={i}>
                                {/* {section.header && <Typography key={i} className={classes.sectionTitle}>{t(section.header)}</Typography>} */}
                                <List>
                                    {
                                        section.header && (
                                            !openDrawer ?
                                                <Hidden mdUp>
                                                    <ListItem>
                                                        <ListItemText primary={t(section.header)} />
                                                    </ListItem>
                                                </Hidden>
                                                :
                                                <ListItem>
                                                    <ListItemText primary={t(section.header)} />
                                                </ListItem>
                                        )
                                    }
                                    {section.menuItems.map((menuItem) => {
                                        return (
                                            <React.Fragment key={menuItem.id} >
                                                <Hidden mdUp>
                                                    <ListItem button component={Link} selected={menuItem.id === selected} to={menuItem.to} onClick={handleDrawerClose}>
                                                        <ListItemIcon>{menuItem.icon}</ListItemIcon>
                                                        <ListItemText primary={t(menuItem.textKey)} />
                                                    </ListItem>
                                                </Hidden>
                                                <Hidden smDown>
                                                    <ListItem button key={menuItem.id} component={Link} selected={menuItem.id === selected} to={menuItem.to} >
                                                        <ListItemIcon>{menuItem.icon}</ListItemIcon>
                                                        {openDrawer ?
                                                            <ListItemText primary={t(menuItem.textKey)} />
                                                            :
                                                            null
                                                        }
                                                    </ListItem>
                                                </Hidden>
                                            </React.Fragment>
                                        )
                                    })
                                    }

                                </List>
                                { sideMenu[i + 1] ? <Divider /> : null}
                            </React.Fragment>
                        )
                    })
                }
            </React.Fragment>
        )
    }

    const handleDrawerToggle = () => {
        alert('toggle')
    }

    const open = true


    return (
        userInfo ? (
            <div>
                <Hidden mdUp>
                    <Drawer
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={openDrawer}
                        onClose={handleDrawerClose}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true,
                        }}
                    >
                        <Toolbar >
                            <IconButton
                                onClick={handleDrawerClose}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                        </Toolbar>
                        <div className={classes.drawerContainer}>
                            {renderDrawer()}
                        </div>
                    </Drawer>
                </Hidden>
                <Hidden smDown>
                    <Drawer
                        className={clsx(classes.drawer, {
                            [classes.drawerOpen]: openDrawer,
                            [classes.drawerClose]: !openDrawer,
                        })}
                        classes={{
                            paper: clsx({
                                [classes.drawerOpen]: openDrawer,
                                [classes.drawerClose]: !openDrawer,
                            }),
                        }}
                        variant="permanent"
                        open={openDrawer}
                    >
                        <Toolbar />
                        <div className={classes.drawerContainer}>
                            {renderDrawer()}
                        </div>
                    </Drawer>
                </Hidden>
            </div >
        ) : null
    )
}

export default SideMenu

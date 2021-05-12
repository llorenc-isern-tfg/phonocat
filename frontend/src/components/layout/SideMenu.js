import React, { useState, useEffect } from 'react'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import Divider from '@material-ui/core/Divider'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import HomeIcon from '@material-ui/icons/Home'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import AlbumIcon from '@material-ui/icons/Album'
import AddBoxIcon from '@material-ui/icons/AddBox'
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket'
import GroupIcon from '@material-ui/icons/Group'
import ChatIcon from '@material-ui/icons/Chat'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
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
        width: theme.spacing(7) + 40,
        [theme.breakpoints.down("sm")]: {
            width: drawerWidth,
        },
    },
}));

const sideMenu = [
    {

        header: undefined,
        menuItems: [
            {
                id: 'home',
                to: '/home',
                icon: <HomeIcon />,
                textKey: 'sideMenu.home',
            },
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

const SideMenu = () => {

    const { t } = useTranslation();

    const classes = useStyles()
    const theme = useTheme()

    const auth = useSelector((state) => state.auth)
    const { userInfo } = auth

    const [mobileOpen, setMobileOpen] = useState(false);

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
                                            <ListItem>
                                                <ListItemText primary={t(section.header)} />
                                            </ListItem>
                                        )
                                    }
                                    {section.menuItems.map((menuItem) => {
                                        return (
                                            <ListItem button key={menuItem.id} component={Link} selected={menuItem.id === selected} to={menuItem.to}>
                                                <ListItemIcon>{menuItem.icon}</ListItemIcon>
                                                <ListItemText primary={t(menuItem.textKey)} />
                                            </ListItem>
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

        /* //     /* <ListItem button key={'home'} component={Link} selected={selected} to={'/app'}>
            //     <ListItemIcon><HomeIcon /></ListItemIcon>
    //     <ListItemText primary={t('sideMenu.home')} />
    // </ListItem>
    // <Divider className={classes.divider} />
    // <Typography className={classes.sectionTitle}>{t('sideMenu.lps')}</Typography>
    // <ListItem button key={'sideMenu.lpCollection'} component={Link} selected={selected} to={'/app/lps'}>
            //     <ListItemIcon><AlbumIcon /></ListItemIcon>
    //     <ListItemText primary={t('sideMenu.lpCollection')} />
    // </ListItem>
    // <ListItem button key={'sideMenu.addLP'} component={Link} selected={selected} to={'/app/lps/new'}>
            //     <ListItemIcon><AddBoxIcon /></ListItemIcon>
    //     <ListItemText primary={t('sideMenu.addLP')} />
    // </ListItem>
    // <Divider className={classes.divider} />
    // <Typography className={classes.sectionTitle}>{t('sideMenu.market')}</Typography>
    // <ListItem button key={'sideMenu.listedItems'}>
            //     <ListItemIcon><LocalOfferIcon /></ListItemIcon>
    //     <ListItemText primary={t('sideMenu.listedItems')} />
    // </ListItem>
    // <ListItem button key={'sideMenu.offers'}>
            //     <ListItemIcon><ShoppingBasketIcon /></ListItemIcon>
    //     <ListItemText primary={t('sideMenu.offers')} />
    // </ListItem>
    // <Divider className={classes.divider} />
    // <Typography className={classes.sectionTitle}>{t('sideMenu.social')}</Typography>
    // <ListItem button key={'sideMenu.users'}>
            //     <ListItemIcon><GroupIcon /></ListItemIcon>
    //     <ListItemText primary={t('sideMenu.users')} />
    // </ListItem>
    // <ListItem button key={'sideMenu.conversations'}>
            //     <ListItemIcon><ChatIcon /></ListItemIcon>
    //     <ListItemText primary={t('sideMenu.conversations')} />
    // </ListItem> */
    }

    const handleDrawerToggle = () => {
        alert('toggle')
    }

    const open = true


    return (
        userInfo ? (
            <div>
                {/* <Hidden smUp>
                    <Drawer
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        <Toolbar />
                        <div className={classes.drawerContainer}>
                            {renderDrawer()}
                        </div>
                    </Drawer>
                </Hidden> */}
                <Hidden xsDown>
                    <Drawer
                        className={clsx(classes.drawer, {
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        })}
                        classes={{
                            paper: clsx({
                                [classes.drawerOpen]: open,
                                [classes.drawerClose]: !open,
                            }),
                        }}
                        variant="permanent"
                        open={open}
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

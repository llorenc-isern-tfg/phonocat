import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Avatar from '@material-ui/core/Avatar'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import SettingsIcon from '@material-ui/icons/Settings'
import LogoutIcon from '@material-ui/icons/PowerSettingsNew';
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import { makeStyles } from '@material-ui/core/styles'
import { deepOrange } from '@material-ui/core/colors'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { useTranslation } from "react-i18next"

import LoginDialog from '../../pages/public/LoginDialog'
import { logout } from '../../actions/userActions'

const LOGIN_DIALOG_ID = 'LOGIN'
const REGISTER_DIALOG_ID = 'LOGIN'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    avatar: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500]
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    }
}));

const Header = () => {

    const dispatch = useDispatch()

    const classes = useStyles();

    const auth = useSelector((state) => state.auth)
    const { userInfo } = auth

    const [openDialog, setOpenDialog] = useState(null);

    var [profileMenu, setProfileMenu] = useState(null);

    const openLoginDialog = () => {
        setOpenDialog(LOGIN_DIALOG_ID)
    }

    const openRegisterDialog = () => {
        setOpenDialog(REGISTER_DIALOG_ID)
    }

    const handleCloseDialog = () => {
        setOpenDialog(null)
    }

    const handleCloseUserMenu = () => {
        setProfileMenu(null)
    }

    const handleLogout = () => {
        dispatch(logout())
        handleCloseUserMenu()
    }

    const { t } = useTranslation();

    return (
        <React.Fragment>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    {userInfo &&
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                    }

                    <Typography variant="h6" className={classes.title}>
                        Phonocat
                        </Typography>
                    {!userInfo ?
                        (  //Usuari no identificat
                            <div>
                                <Button startIcon={<LockOpenIcon />} color="inherit" onClick={openLoginDialog}>LOGIN</Button>
                            </div>
                        ) :
                        ( // Usuari identificat
                            <div>
                                <IconButton
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={e => setProfileMenu(e.currentTarget)}
                                    color="inherit"
                                >
                                    {/* Intenta carregar imatge, si no primera lletra de alt i sino icona generica  */}
                                    <Avatar className={classes.avatar}
                                        alt={userInfo.username.toUpperCase()} src={userInfo.profilePic ? userInfo.profilePic : '/no_profile_pic.jpg'} />
                                </IconButton>

                                <Menu
                                    id="profile-menu"
                                    open={Boolean(profileMenu)}
                                    anchorEl={profileMenu}
                                    onClose={handleCloseUserMenu}
                                    getContentAnchorEl={null}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                >
                                    <MenuItem>
                                        <ListItemIcon>
                                            <AccountCircleIcon color="primary" fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary={t('userMenu.profile')} />
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        <ListItemIcon>
                                            <LogoutIcon color="secondary" fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary={t('userMenu.signout')} />
                                    </MenuItem>
                                </Menu>
                            </div>
                        )
                    }
                </Toolbar>
            </AppBar>
            <LoginDialog open={openDialog === LOGIN_DIALOG_ID} onClose={handleCloseDialog} />
        </React.Fragment >
        //TODO: afegir dialog registre una vegada desenvolupat 

    )
}

export default Header




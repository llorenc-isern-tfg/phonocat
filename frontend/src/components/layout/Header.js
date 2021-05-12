import React, { useState, useEffect } from 'react'
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
import LogoutIcon from '@material-ui/icons/PowerSettingsNew'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import TranslateIcon from '@material-ui/icons/Translate'
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import { makeStyles } from '@material-ui/core/styles'
import { deepOrange } from '@material-ui/core/colors'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { useTranslation } from "react-i18next"
import { Link } from 'react-router-dom'
import i18n from "i18next";

import LoginDialog from '../../pages/public/LoginDialog'
import RegisterDialog from '../../pages/public/RegisterDialog'
import { logout } from '../../actions/userActions'
import languages from '../../constants/languages'

const LOGIN_DIALOG_ID = 'LOGIN'
const REGISTER_DIALOG_ID = 'REGISTER'

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
        backgroundColor: deepOrange[500],
        boxShadow: theme.shadows[3],
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    languageButton: {
        marginRight: 25
    }
}));

const Header = () => {

    const dispatch = useDispatch()

    const classes = useStyles();

    const auth = useSelector((state) => state.auth)
    const { userInfo } = auth

    const [language, setLanguage] = useState(auth.userInfo ? auth.userInfo.language : 'ca')

    useEffect(() => {
        if (userInfo)
            setLanguage(userInfo.language)
    }, [userInfo])

    useEffect(() => {
        i18n.changeLanguage(language)
    }, [language])

    const [openDialog, setOpenDialog] = useState(null)

    var [profileMenu, setProfileMenu] = useState(null)

    var [languageMenu, setLanguageMenu] = useState(null)

    const openLoginDialog = () => {
        handleCloseDialog()
        setOpenDialog(LOGIN_DIALOG_ID)
    }

    const openRegisterDialog = () => {
        handleCloseDialog()
        setOpenDialog(REGISTER_DIALOG_ID)
    }

    const handleCloseDialog = () => {
        setOpenDialog(null)
    }

    const handleCloseUserMenu = () => {
        setProfileMenu(null)
    }

    const handleCloseLanguageMenu = () => {
        setLanguageMenu(null)
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
                                <Button startIcon={<TranslateIcon />} endIcon={<ExpandMoreIcon />}
                                    color="inherit" onClick={e => setLanguageMenu(e.currentTarget)}
                                    className={classes.languageButton}>
                                    {languages.find(lang => lang.code === language).name}
                                </Button>
                                <Menu
                                    id="language-menu"
                                    open={Boolean(languageMenu)}
                                    anchorEl={languageMenu}
                                    onClose={handleCloseLanguageMenu}
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
                                    {languages.map((lang) => (
                                        <MenuItem key={lang.code} onClick={() => {
                                            setLanguage(lang.code)
                                            handleCloseLanguageMenu()
                                        }} >
                                            <ListItemText primary={lang.name} />
                                        </MenuItem>
                                    ))
                                    }

                                </Menu>
                                <Button startIcon={<LockOpenIcon />} color="inherit" onClick={openLoginDialog}>LOGIN</Button>
                                <Button color="inherit" onClick={openRegisterDialog}>{t('registerForm.signup').toUpperCase()}</Button>
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
                                        alt={userInfo.username.toUpperCase()} src={userInfo.picture ? userInfo.picture : '/no_profile_pic.jpg'} />
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
                                    <MenuItem component={Link} to="/profile" onClick={handleCloseUserMenu}>
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
            <RegisterDialog open={openDialog === REGISTER_DIALOG_ID} onClose={handleCloseDialog} selectedLanguage={language} />
        </React.Fragment >
        //TODO: afegir dialog registre una vegada desenvolupat 

    )
}

export default Header




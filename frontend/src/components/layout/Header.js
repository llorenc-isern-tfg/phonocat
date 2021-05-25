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
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import { makeStyles } from '@material-ui/core/styles'
import { deepOrange } from '@material-ui/core/colors'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { useTranslation } from "react-i18next"
import { Link } from 'react-router-dom'
import i18n from "i18next"
import ListItem from '@material-ui/core/ListItem'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import LoginDialog from '../../pages/public/LoginDialog'
import RegisterDialog from '../../pages/public/RegisterDialog'
import { logout } from '../../actions/userActions'
import languages from '../../constants/languages'
import { LOGIN_DIALOG_ID, REGISTER_DIALOG_ID } from '../../constants/constants'
import { Hidden } from '@material-ui/core'



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
}))

const matchBrowserLanguage = (browserLanguage) => {
    console.log(browserLanguage)
    return ['ca', 'es', 'en'].includes(browserLanguage) ? browserLanguage : 'ca'
}

const Header = ({ handleDrawerOpen, handleDrawerClose, openDrawer,
    handleCloseDialog, handleChangeDialog, openDialog }) => {


    const dispatch = useDispatch()

    const classes = useStyles();

    const auth = useSelector((state) => state.auth)
    const { userInfo } = auth

    const [language, setLanguage] = useState(auth.userInfo ? auth.userInfo.language : matchBrowserLanguage(i18n.languages[0]))

    useEffect(() => {
        if (userInfo)
            setLanguage(userInfo.language)
    }, [userInfo])

    useEffect(() => {
        i18n.changeLanguage(language)
    }, [language])

    // const [openDialog, setOpenDialog] = useState(null)

    const [profileMenu, setProfileMenu] = useState(null)

    const [languageMenu, setLanguageMenu] = useState(null)

    const [mobilePublicMenu, setMobilePublicMenu] = useState(null)

    const [openLanguage, setOpenLanguage] = useState(false)

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

    const handleCloseMobilePublicMenu = () => {
        setMobilePublicMenu(null)
        setOpenLanguage(false)
    }

    const { t } = useTranslation();

    return (
        <React.Fragment>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    {userInfo &&
                        <IconButton onClick={openDrawer ? handleDrawerClose : handleDrawerOpen}
                            edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                    }

                    <Typography variant="h6" className={classes.title}>
                        Phonocat
                        </Typography>
                    {!userInfo ?
                        (  //Usuari no identificat
                            <div>
                                <Hidden smDown>
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
                                    <Button startIcon={<LockOpenIcon />} color="inherit" onClick={() => handleChangeDialog(LOGIN_DIALOG_ID)}>LOGIN</Button>
                                    <Button color="inherit" onClick={() => handleChangeDialog(REGISTER_DIALOG_ID)}>{t('registerForm.signup').toUpperCase()}</Button>
                                </Hidden>
                                <Hidden mdUp>
                                    <IconButton
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={e => setMobilePublicMenu(e.currentTarget)}
                                        color="inherit"
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                    <Menu
                                        id="profile-menu"
                                        open={Boolean(mobilePublicMenu)}
                                        anchorEl={mobilePublicMenu}
                                        onClose={handleCloseMobilePublicMenu}
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
                                        <MenuItem onClick={() => { handleChangeDialog(LOGIN_DIALOG_ID); handleCloseMobilePublicMenu() }}>
                                            <ListItemText primary={'LOGIN'} />
                                        </MenuItem>
                                        <MenuItem onClick={() => { handleChangeDialog(REGISTER_DIALOG_ID); handleCloseMobilePublicMenu() }}>
                                            <ListItemText primary={t('registerForm.signup').toUpperCase()} />
                                        </MenuItem>
                                        <ListItem button onClick={() => setOpenLanguage(!openLanguage)}>
                                            <ListItemText primary={t('generic.language').toUpperCase()} />
                                            {openLanguage ? <ExpandLess /> : <ExpandMore />}
                                        </ListItem>
                                        <Collapse in={openLanguage} timeout="auto" unmountOnExit>
                                            {languages.map((lang) => (
                                                <MenuItem key={lang.code} onClick={() => {
                                                    setLanguage(lang.code)
                                                    handleCloseMobilePublicMenu()
                                                }} >
                                                    <ListItemText primary={lang.name} />
                                                </MenuItem>
                                            ))
                                            }
                                        </Collapse>
                                    </Menu>
                                </Hidden>
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
            <LoginDialog open={openDialog === LOGIN_DIALOG_ID} onClose={handleCloseDialog} onChangeDialog={handleChangeDialog} />
            <RegisterDialog open={openDialog === REGISTER_DIALOG_ID} onClose={handleCloseDialog} selectedLanguage={language} onChangeDialog={handleChangeDialog} />
        </React.Fragment >

    )
}

export default Header




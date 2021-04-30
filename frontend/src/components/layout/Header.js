import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Avatar from '@material-ui/core/Avatar';
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { makeStyles } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors';

import LoginDialog from '../../pages/public/LoginDialog'

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
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: red[500]
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
}));


const Header = () => {

    const classes = useStyles();

    const auth = useSelector((state) => state.auth)
    const { userInfo } = auth

    const [openDialog, setOpenDialog] = useState(null);

    const openLoginDialog = () => {
        setOpenDialog(LOGIN_DIALOG_ID)
    }

    const openRegisterDialog = () => {
        setOpenDialog(REGISTER_DIALOG_ID)
    }

    const handleClose = () => {
        setOpenDialog(null)
    }

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
                                {/* Intenta carregar imatge, si no primera lletra de alt i sino icona generica  */}
                                <Avatar className={classes.avatar}
                                    alt={userInfo.username.toUpperCase()} src={userInfo.profilePic ? userInfo.profilePic : '/no_profile_pic.jpg'} />
                                {/* <Menu
                                        id="menu-appbar"
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={open}
                                        onClose={handleClose}
                                    >
                                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                                        <MenuItem onClick={handleClose}>My account</MenuItem>
                                    </Menu> */}
                            </div>
                        )
                    }
                </Toolbar>
            </AppBar>
            <LoginDialog open={openDialog === LOGIN_DIALOG_ID} onClose={handleClose} />
        </React.Fragment >
        //TODO: afegir dialog registre una vegada desenvolupat 

    )
}

export default Header




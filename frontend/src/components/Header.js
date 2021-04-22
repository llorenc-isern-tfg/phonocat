import { React, useState } from 'react'
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

import LoginDialog from '../pages/public/LoginDialog'
import { Box } from '@material-ui/core';

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
}));

const Header = () => {

    const classes = useStyles();

    const auth = useSelector((state) => state.auth)
    const { userInfo, loading } = auth

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
        <div>
            <div className={classes.root}>
                <Box mb={4}>
                    <AppBar position="static">
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
                                        <Avatar alt={userInfo.username} src={userInfo.profilePic ? userInfo.profilePic : '/brokenimage.jpg'} />
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
                </Box>
            </div>
            <LoginDialog open={openDialog === LOGIN_DIALOG_ID} onClose={handleClose} />
            {/* //TODO: afegir dialog registre una vegada desenvolupat */}
        </div >
    )
}

export default Header




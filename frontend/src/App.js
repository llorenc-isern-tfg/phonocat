import React, { useState } from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { CssBaseline, ThemeProvider } from '@material-ui/core'

import PrivateRoute from './components/app/PrivateRoute'
import Header from './components/layout/Header'
import LandingPage from './pages/public/LandingPage'
import LpCollectionPage from './pages/private/LpCollectionPage'
import LpDetailPage from './pages/private/LpDetailPage'
import EditLpPage from './pages/private/EditLpPage'
import AddLpPage from './pages/private/AddLpPage'
import history from './history'
import theme from './pages/theme'
import Alerts from './components/shared/Alerts'
import SideMenu from './components/layout/SideMenu'
import NotFoundPage from './pages/public/NotFoundPage'
import UserProfilePage from './pages/private/UserProfilePage'
import UserListPage from './pages/private/UserListPage'
import UserDetailPage from './pages/private/UserDetailPage'
import ListedItemsPage from './pages/private/ListedItemsPage'
import OffersPage from './pages/private/OffersPage'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex', //important per l'espai del menu lateral
        flexGrow: 1,
    },
    mainContent: {
        flexGrow: 1,
        height: '100%',
        overflow: 'auto',
    },
    appBarSpacer: theme.mixins.toolbar,
}));

const App = () => {

    const [openDialog, setOpenDialog] = useState(null)
    const [openDrawer, setOpenDrawer] = useState(true)

    const handleDrawerOpen = () => {
        setOpenDrawer(true);
    }

    const handleDrawerClose = () => {
        setOpenDrawer(false);
    }

    const handleCloseDialog = () => {
        setOpenDialog(null)
    }

    const handleChangeDialog = (dialogId) => {
        handleCloseDialog()
        setOpenDialog(dialogId)
    }

    const classes = useStyles();

    return (
        <Router history={history}>
            <ThemeProvider theme={theme}>
                <div className={classes.root}>
                    <CssBaseline />
                    <Header handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} openDrawer={openDrawer}
                        handleCloseDialog={handleCloseDialog} handleChangeDialog={handleChangeDialog} openDialog={openDialog} />
                    <SideMenu handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} openDrawer={openDrawer} />
                    <Alerts />
                    <main className={classes.mainContent} id="mainContent">
                        <div className={classes.appBarSpacer} />
                        <Switch>
                            <Route path="/" exact render={(props => (
                                <LandingPage {...props} handleChangeDialog={handleChangeDialog} />
                            ))} />
                            <PrivateRoute path="/lp/collection" exact component={LpCollectionPage} />
                            <PrivateRoute path='/lp/collection/:id' exact component={LpDetailPage} />
                            <PrivateRoute path='/lp/collection/:id/edit' exact component={EditLpPage} />
                            <PrivateRoute path="/lp/new" exact component={AddLpPage} />
                            <PrivateRoute path='/profile' exact component={UserProfilePage} />
                            <PrivateRoute path='/users' exact component={UserListPage} />
                            <PrivateRoute path='/users/:username' exact component={UserDetailPage} />
                            <PrivateRoute path='/listedItems' exact component={ListedItemsPage} />
                            <PrivateRoute path='/myOffers' exact component={OffersPage} />
                            <Route component={NotFoundPage} />
                        </Switch>
                    </main>
                </div>
            </ThemeProvider>
        </Router >
    )
}

export default App
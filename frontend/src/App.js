import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { CssBaseline, ThemeProvider } from '@material-ui/core'

import PrivateRoute from './components/app/PrivateRoute'
import Header from './components/layout/Header'
import LandingPage from './pages/public/LandingPage'
import HomePage from './pages/private/HomePage'
import LpCollectionPage from './pages/private/LpCollectionPage'
import AddLpPage from './pages/private/AddLpPage'
import history from './history'
import theme from './pages/theme'
import Alerts from './components/shared/Alerts'
import SideMenu from './components/layout/SideMenu'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex', //important per l'espai del menu lateral
        flexGrow: 1,
    },
    mainContent: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        padding: theme.spacing(3)
    },
    appBarSpacer: theme.mixins.toolbar,
}));

const App = () => {

    const classes = useStyles();

    return (
        <Router history={history}>
            <ThemeProvider theme={theme}>
                <div className={classes.root}>
                    <CssBaseline />
                    <Header />
                    <SideMenu />
                    <Alerts />
                    <main className={classes.mainContent}>
                        <div className={classes.appBarSpacer} />
                        <Switch>
                            <Route path="/" exact component={LandingPage} />
                            <PrivateRoute path="/app" exact component={HomePage} />
                            <PrivateRoute path="/app/lps" exact component={LpCollectionPage} />
                            <PrivateRoute path="/app/lps/new" exact component={AddLpPage} />
                        </Switch>
                    </main>
                </div>
            </ThemeProvider>
        </Router >
    )
}

export default App
import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'

import PrivateRoute from './components/PrivateRoute'
import Header from './components/Header'
import LandingPage from './pages/public/LandingPage'
import history from './history'
import { CssBaseline } from '@material-ui/core'

const App = () => {

    return (
        // <React.Fragment>
        <Router history={history}>
            <CssBaseline />
            <div>
                <Header />
                <Switch>
                    <Route path="/" exact component={LandingPage} />
                    <PrivateRoute path="/app" exact component={LandingPage} />
                </Switch>
            </div>
        </Router>
        // </React.Fragment>
    )
}

export default App
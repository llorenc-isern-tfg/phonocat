import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux'

//Redirecciona a la pàgina d'inici si l'usuari no està autenticat
function PrivateRoute({ component: Component, ...rest }) {

    const auth = useSelector((state) => state.auth)
    const { userInfo } = auth


    return <Route {...rest} render={props => (
        userInfo ? <Component {...props} /> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />
    )} />
}

export default PrivateRoute
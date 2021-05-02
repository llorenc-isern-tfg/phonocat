import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux'

//Redirecciona a la pàgina d'inici si l'usuari no està autenticat
function PrivateRoute({ component: Component }) {

    const auth = useSelector((state) => state.auth)
    const { userInfo } = auth

    console.log(auth)
    return (
        <Route render={props => {
            if (!userInfo) {
                return <Redirect to={{ pathname: '/', state: { from: props.location } }} />
            }
            return <Component {...props} />
        }} />
    );
}

export default PrivateRoute
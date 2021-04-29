import React from 'react';
import { Route, Redirect } from 'react-router-dom';

//Redirecciona a la pàgina d'inici si l'usuari no està autenticat
function PrivateRoute({ component: Component }) {
    return (
        <Route render={props => {
            console.log(props)
            if (!localStorage.getItem('userInfo')) {
                return <Redirect to={{ pathname: '/', state: { from: props.location } }} />
            }
            return <Component {...props} />
        }} />
    );
}

export default PrivateRoute
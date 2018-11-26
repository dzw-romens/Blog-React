import * as React from 'react';
import { Route } from 'react-router-dom';
import Login from '../component/containers/login';

class Routers extends React.Component {
    render() {
        return (
            <Route path="/" component={Login}>
                <Route path="/login" component={Login} />
            </Route>
        );
    }
}

export default Routers;
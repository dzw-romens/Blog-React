import * as React from 'react';
import { Route } from 'react-router-dom';
import Login from '../components/containers/login';
import { BrowserRouter as Router } from "react-router-dom";

class Routers extends React.Component {
    render() {
        return (
            <Router>
                <Route path="/" component={Login}>
                    <Route path="/login" component={Login} />
                    {/* <Route path="/home" component={Home} />
                    <Route path="/timeLine" component={TimeLine} />
                    <Route path="/airtical" component={Airtical} />
                    <Route path="/category" component={Category} /> */}
                </Route>
            </Router>
        );
    }
}

export default Routers;
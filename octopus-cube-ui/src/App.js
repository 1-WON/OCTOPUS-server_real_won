import {HashRouter, Route, Router, Switch} from 'react-router-dom'
import './App.scss';
import React, {Component} from "react";
import 'react-datepicker/dist/react-datepicker.css'

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
const Login = React.lazy(() => import("./views/Login"));
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

class App extends Component {

  render() {
    return (
        <HashRouter>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route exact path={"/login"} render={props => <Login {...props}/>}/>
              <Route path="/" name="Home" render={props => <DefaultLayout {...props}/>}/>
            </Switch>
          </React.Suspense>
        </HashRouter>
    )
  }

}

export default App;

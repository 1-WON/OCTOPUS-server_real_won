import React, {Component, Suspense} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import * as router from 'react-router-dom';
import {Container} from 'reactstrap';

import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';
import axios from 'axios';
//import Loader from "../../views/Loader/Loader";

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const  DefaultHeader = React.lazy(() => import('./DefaultHeader'));

let menuList = {};

class DefaultLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      backDrop: false
    }
  }

  componentDidMount() {
    const userId = window.sessionStorage.getItem("userId");
    console.log("userId",userId);
    if(userId == null) {
      this.props.history.push('/login');
    }
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  signOut(e) {
    e.preventDefault()
    window.sessionStorage.removeItem("userId");
    this.props.history.push('/login')
  }

  setLoader = (loading, backDrop = false) => {
    this.setState({loading, backDrop})
  }

  render() {
    return (
        <div className="app">
          {/*<Loader loading={this.state.loading} backDrop={this.state.backDrop}/>*/}
          <AppHeader fixed>
            <Suspense fallback={this.loading()}>
              <DefaultHeader onLogout={e => this.signOut(e)}/>
            </Suspense>
          </AppHeader>
          <div className="app-body">
            <AppSidebar fixed display="lg">
              <AppSidebarHeader/>
              <AppSidebarForm/>
              <Suspense>
                <AppSidebarNav navConfig={navigation} {...this.props} router={router}/>
              </Suspense>
              <AppSidebarFooter/>
              <AppSidebarMinimizer/>
            </AppSidebar>
            <main className="main">
              <AppBreadcrumb appRoutes={routes} router={router}/>
              <Container fluid>
                <Suspense fallback={this.loading()}>
                  <Switch>
                    {routes.map((route, idx) => {
                      return route.component ? (
                          <Route
                              key={idx}
                              path={route.path}
                              exact={route.exact}
                              name={route.name}
                              render={props => (
                                  <route.component {...props} setLoader={this.setLoader}/>
                              )}/>
                      ) : (null);
                    })}
                    <Redirect from="/" to="/pre_consult"/>
                  </Switch>
                </Suspense>
              </Container>
            </main>
            <AppAside fixed>
              <Suspense fallback={this.loading()}>
                <DefaultAside/>
              </Suspense>
            </AppAside>
          </div>
          {/*<AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>*/}
        </div>
    );
  }
}

export default DefaultLayout;

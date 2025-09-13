import React, { useState, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import { AuthContext } from './shared/context/auth-context';
import Users from './users/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UpdatePlace from './places/pages/UpdatePlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import Auth from './users/pages/Auth';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);
  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);
  return (
    <AuthContext.Provider value={(isLoggedIn, login, logout)}>
      <Router>
        <MainNavigation />
        <main>
          <Switch>
            <Route path='/' exact={true}>
              <Users />
            </Route>
            <Route path='/auth' exact={true}>
              <Auth />
            </Route>
            <Route path='/:userId/places'>
              <UserPlaces />
            </Route>
            <Route path='/places/new'>
              <NewPlace />
            </Route>
            <Route path='/places/:placeId'>
              <UpdatePlace />
            </Route>
            <Redirect to='/' />
          </Switch>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;

import './App.css';
import { 
  BrowserRouter as Router,
  Route, 
  Switch,
Redirect
 } from 'react-router-dom';
import Home from './pages/Home/Home';
import Navigation from './components/shared/Navigation/Navigation';
import Authenticate from './pages/Authenticate/Authenticate';
import Activate from './pages/Activate/Activate';
import Rooms from './pages/Rooms/Rooms';
import Room from './pages/Room/Room';
import {useSelector} from 'react-redux';
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';
import Loader from './components/shared/Loader/Loader';


function App() {

    // call refresh endpoint so that user can logged in even after refreshing the page.
    const { loading } = useLoadingWithRefresh();
    return loading ? (
        <Loader message="Loading, please wait.." />
    ) : (
    <Router>
      <Navigation/>
    <Switch>
    <GuestRoute path="/" exact>
        <Home />
    </GuestRoute>
    <GuestRoute path="/authenticate">
        <Authenticate />
        </GuestRoute>
              <SemiProtectedRoute path="/activate">
                    <Activate />
                </SemiProtectedRoute>
                <ProtectedRoute path="/rooms">
                    <Rooms/>
                </ProtectedRoute>
                <ProtectedRoute path="/room/:id">
                    <Room/>
                </ProtectedRoute>
        {/* <Route path="/authenticate" element={<GuestRoute><Authenticate/></GuestRoute>}/> */}
       
    </Switch>
</Router>
  );
}

const GuestRoute = ({ children, ...rest }) => {

const { isAuth } = useSelector((state) => state.auth);

  return (
      <Route
          {...rest}
          render={({ location }) => {
              return isAuth ? (
                  <Redirect
                      to={{
                          pathname: '/rooms',
                          state: { from: location },    //kahan se redirect hore hai
                      }}
                  />
              ) : (
                  children
              );
          }}
      ></Route>
  );
};

const SemiProtectedRoute = ({ children, ...rest }) => {
    const { user, isAuth } = useSelector((state) => state.auth);

  return (
      <Route
          {...rest}
          render={({ location }) => {
              return !isAuth ? (
                  <Redirect
                      to={{
                          pathname: '/',
                          state: { from: location },
                      }}
                  />
              ) : isAuth && !user.activated ? (
                  children
              ) : (
                  <Redirect
                      to={{
                          pathname: '/rooms',
                          state: { from: location },
                      }}
                  />
              );
          }}
      ></Route>
  );
};


const ProtectedRoute = ({ children, ...rest }) => {
    const { user, isAuth } = useSelector((state) => state.auth);

  return (
      <Route
          {...rest}
          render={({ location }) => {
              return !isAuth ? (
                  <Redirect
                      to={{
                          pathname: '/',
                          state: { from: location },
                      }}
                  />
              ) : isAuth && !user.activated ? (
                  <Redirect
                      to={{
                          pathname: '/activate',
                          state: { from: location },
                      }}
                  />
              ) : (
                  children
              );
          }}
      ></Route>
  );
};

export default App;



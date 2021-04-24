import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Home from './components/Home'
import { Container, Row, Col } from 'react-bootstrap'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm';
import API from './api/Api'



import { Redirect, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import { AuthContext } from './auth/AuthContext';
import { withRouter } from 'react-router-dom';
import Map from './components/Map';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    API.isAuthenticated().then(
      (user) => {
        this.setState({ authUser: user });
      }
    ).catch((err) => {
      this.setState({ authErr: err.errorObj });
      // this.props.history.push("/login");
    });

  }

  logout = () => {
    console.log('logout')
    API.userLogout().then(() => {
      this.setState({ authUser: null, authErr: null });
    });
  }

  login = (username, password) => {
    API.userLogin(username, password).then(
      (user) => {
        this.setState({ authUser: user, authErr: null });
        this.props.history.push("/");
      }
    ).catch(
      (errorObj) => {
        console.log(errorObj)
        const err0 = errorObj.errors[0];
        this.setState({ authErr: err0 });
      }
    );
  }

  signup = (username, password) => {
    API.userSignup(username, password).then(
      () => {
        this.props.history.push("/login");
      }
    ).catch(
      (errorObj) => {
        console.log(errorObj)
        const err0 = errorObj.errors[0];
        this.setState({ authErr: err0 });
      }
    );
  }

  render() {
    const value = {
      authUser: this.state.authUser,
      authErr: this.state.authErr,
      loginUser: this.login,
      logoutUser: this.logout,
      signUpUser: this.signup

    }
    return (
      <AuthContext.Provider value={value}>
        <Header showSidebar={this.showSidebar} getPublicTasks={this.getPublicTasks} />
        <Container fluid>
          <Switch>
            <Route path="/login">
              <Row className="vheight-100">
                <Col sm={4}></Col>
                <Col sm={4} className="below-nav">
                  <LoginForm />
                </Col>
              </Row>
            </Route>

            <Route path="/signup">
              <Row className="vheight-100">
                <Col sm={4}></Col>
                <Col sm={4} className="below-nav">
                  <SignupForm />
                </Col>
              </Row>
            </Route>

            <Route path="/map">
              <Row className="vheight-100">
                <Col sm={12} className="below-nav">
                  <Map></Map>
                </Col>
              </Row>
            </Route>

            <Route path="/">
              <Row className="vheight-100">
                <Col sm={12} className="below-nav">
                  <Home></Home>
                </Col>
              </Row>
            </Route>

            <Route>
              <Redirect to='/' />
            </Route>
          </Switch>
        </Container>
      </AuthContext.Provider>
    );
  }

}

export default withRouter(App);

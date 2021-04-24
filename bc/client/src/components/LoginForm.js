import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { AuthContext } from '../auth/AuthContext'
import { Link } from 'react-router-dom';

class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = { username: '', password: '', submitted: false, };
    }

    onChangeUsername = (event) => {
        this.setState({ username: event.target.value });
    };

    onChangePassword = (event) => {
        this.setState({ password: event.target.value });
    };

    handleSubmit = async (event, onLogin) => {
        event.preventDefault();
        onLogin(this.state.username, this.state.password);
        this.setState({ submitted: true });
    }

    render() {
        return (
            <AuthContext.Consumer>
                {(context) => (
                    <>
                        <Container style={{ color: 'white' }} fluid>
                            <Row>
                                <Col>
                                    <h2 className="ui teal image header">
                                        <div className="content">
                                            Log in to your account
                                        </div>
                                    </h2>

                                    <Form method="POST" onSubmit={(event) => this.handleSubmit(event, context.loginUser)}>
                                        <Form.Group controlId="username">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control type="text" name="username" placeholder="Username" value={this.state.username} onChange={(ev) => this.onChangeUsername(ev)} required autoFocus />
                                        </Form.Group>

                                        <Form.Group controlId="password">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password" name="password" placeholder="Password" value={this.state.password} onChange={(ev) => this.onChangePassword(ev)} required />
                                        </Form.Group>


                                        <Button variant="outline-light" type="submit">Login</Button>
                                        <br />
                                        <div className="mt-2">
                                            <span >Dose not have a acount? <Link to="/signup">create account</Link></span>
                                        </div>

                                    </Form>

                                    {context.authErr &&
                                        <Alert variant="danger mt-5">
                                            {context.authErr.msg}
                                        </Alert>
                                    }
                                </Col>
                            </Row>
                        </Container>
                    </>
                )}
            </AuthContext.Consumer>

        );
    }


}

export default LoginForm;
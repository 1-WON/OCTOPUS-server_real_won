import React, {Component} from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap';
import axios from 'axios';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      visible: false
    }
  }

  onUserCodeChange = event => {
    this.setState({email: event.target.value})
  };

  onPasswordChange = event => {
    this.setState({password: event.target.value})
  };

  onLoginClick = () => {
    const {email,password} = this.state;
    this.setState({visible: false});
    axios({
      method: 'POST',
      url: '/v1/login',
      data: {
        email: email,
        password: password
      },
    }).then(
        (response) => {
          console.log(response);
          window.sessionStorage.setItem('authToken',response.data.authToken);
          window.sessionStorage.setItem('userId',response.data.userId);
          window.sessionStorage.setItem('email',response.data.email);
          window.sessionStorage.setItem('userName',response.data.userName);
          this.props.history.push('/');

          this.props.history.push('/');
        },
        (error) => {
          console.log(error)
          this.setState({visible: true})
        }
    )
  };


  onKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.onLoginClick();
    }
  };

  onDismiss = () => {
    this.setState({visible: false});
  };

  render() {
    return (
        <div className="app flex-row align-items-center" onKeyPress={this.onKeyPress}>
          <Container>
            <Row className="justify-content-center">
              <Col md="5">
                <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismiss}>
                  로그인 정보를 확인해 주세요.
                </Alert>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md="5">
                <CardGroup>
                  <Card className="p-4">
                    <CardBody>
                      <Form>
                        <h1>로그인</h1>
                        <p className="text-muted">Sign In to your account</p>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="text" name="email" value={this.state.userCode} placeholder="Username" autoComplete="username" onChange={this.onUserCodeChange}/>
                        </InputGroup>
                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="password" name="password" value={this.state.password} placeholder="Password" autoComplete="current-password"
                                 onChange={this.onPasswordChange}/>
                        </InputGroup>
                        <Row>
                          <Col xs="6">
                            <Button color="primary" className="px-4" onClick={this.onLoginClick}>로그인</Button>
                          </Col>
                          {/*<Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col>*/}
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                </CardGroup>
              </Col>
            </Row>
          </Container>
        </div>
    );
  }
}

export default Login;

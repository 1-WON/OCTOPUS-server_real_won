import React, {Component} from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  Row,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter
} from 'reactstrap';
import axios from 'axios'

class RegisterPolicyLoginPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: props.userInfo.email,
      password: "",
      confirmPassword: "",
      userName: props.userInfo.userName,
      deptName: props.userInfo.deptName,
      role_1: false,
      role_2: false,
      role_3: false,
      role_4: false,
      role_5: false,
      status: props.userInfo.status
    }
    const roles = props.userInfo.role;
    if (!roles) return;
    roles.forEach(role => {
      switch (role) {
        case 1:
          this.state.role_1 = true;
          break;
        case 2:
          this.state.role_2 = true;
          break;
        case 3:
          this.state.role_3 = true;
          break;
        case 4:
          this.state.role_4 = true;
          break;
        case 5:
          this.state.role_5 = true;
          break;
        default:
      }
    });
  }

  componentDidMount() {
  }

  onChangeValue = (e) => {
    switch (e.target.name) {
      case 'role_1':
      case 'role_2':
      case 'role_3':
      case 'role_4':
      case 'role_5':
        this.setState({
          [e.target.name]: e.target.checked
        })
        break;
      default:
        this.setState({
          [e.target.name]: e.target.value
        })
    }
  }

  renderModalFooter() {
    const {email} = this.state;
    if (!email) {
      return (
          <>
            <Button color="primary">저장</Button>{' '}
            <Button color="secondary" onClick={this.props.toggle}>취소</Button>
          </>
      )
    } else {
      return (
          <>
            <Button color="primary">수정</Button>{' '}
            <Button color="danger">사용자 삭제</Button>{' '}
            <Button color="secondary" onClick={this.props.toggle}>취소</Button>
          </>
      )
    }
  }

  render() {
    const {email, userName, deptName, status, password, confirmPassword, role_1, role_2, role_3, role_4, role_5} = this.state;
    const colStyle = {paddingRight: 0}
    return (
        <Modal
            isOpen={this.props.isOpen}
            toggle={this.props.toggle}
            className={'modal-primary'}>
          <ModalHeader toggle={this.toggle}>{email ? '사용자 수정' : '사용자 추가'}</ModalHeader>
          <ModalBody>
            <Form>
              <Row>
                <Col xs="12" md="12">
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>ID(email)</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" name="email" placeholder="예)admin@email.com" value={email} onChange={this.onChangeValue}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>비밀번호</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="password" name="password" value={password} onChange={this.onChangeValue}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>비밀번호 확인</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="password" name="confirmPassword" value={confirmPassword} onChange={this.onChangeValue}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>이름</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" name="userName" value={userName} onChange={this.onChangeValue}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>소속부서(팀)</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" name="deptName" value={deptName} onChange={this.onChangeValue}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>계정 상태</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="select" name="status" value={status} onChange={this.onChangeValue}>
                        <option value={1}>정상</option>
                        <option value={2}>휴면</option>
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>가명처리 역할</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <FormGroup check className="checkbox">
                        <Input id="role_1" className="form-check-input" type="checkbox" name="role_1" onChange={this.onChangeValue} checked={role_1}/>
                        <Label className="form-check-label" htmlFor="role_1">가명처리 수행자</Label>
                      </FormGroup>
                      <FormGroup check className="checkbox">
                        <Input id="role_2" iclassName="form-check-input" type="checkbox" name="role_2" onChange={this.onChangeValue} checked={role_2}/>
                        <Label check className="form-check-label" htmlFor="role_2">가명정보 결합자</Label>
                      </FormGroup>
                      <FormGroup check className="checkbox">
                        <Input id="role_3" className="form-check-input" type="checkbox" name="role_3" onChange={this.onChangeValue} checked={role_3}/>
                        <Label check className="form-check-label" htmlFor="role_3">적정성 검토자</Label>
                      </FormGroup>
                      <FormGroup check className="checkbox">
                        <Input id="role_4" className="form-check-input" type="checkbox" name="role_4" onChange={this.onChangeValue} checked={role_4}/>
                        <Label check className="form-check-label" htmlFor="role_4">사후관리 담당자</Label>
                      </FormGroup>
                      <FormGroup check className="checkbox">
                        <Input id="role_5" className="form-check-input" type="checkbox" name="role_5" onChange={this.onChangeValue} checked={role_5}/>
                        <Label check className="form-check-label" htmlFor="role_5">가명정보 사용자</Label>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            {this.renderModalFooter()}
          </ModalFooter>
        </Modal>
    );
  }
}

export default RegisterPolicyLoginPopup;

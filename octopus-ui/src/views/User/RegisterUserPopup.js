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

class RegisterUserPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginPolicyList: []
    }
  }

  componentDidMount() {
    this.fetchLoginPolicyData()
  }

  fetchLoginPolicyData() {
    this.props.setLoader(true);
    axios({
      method: 'POST',
      url: '/v1/login_policy/list',
      data: {type: 1},
    }).then(
        (response) => {
          this.props.setLoader(false);
          console.log(response);
          if (response.data.policyList == null) {
            this.setState({loginPolicyList: []});
            return;
          }
          this.setState({loginPolicyList: response.data.policyList});
        },
        (error) => {
          this.props.setLoader(false);
          console.log(error)
        }
    );
  }

  registerUser = () => {
    const {userId, email, password, confirmPassword, userName, deptName, roleIdList, status, loginPolicyId} = this.props.userInfo;
    if (!email) {
      alert("이메일을 입력해 주세요");
      return;
    }
    if (!this.props.isUpdate) {
      if (!password) {
        alert("비밀번호를 입력해 주세요");
        return;
      }
      if (password !== confirmPassword) {
        alert("비밀번호가 일치 하지 않습니다");
        return;
      }
    }
    if (!userName) {
      alert("이름을 입력해 주세요");
      return;
    }
    if (!deptName) {
      alert("부서를 입력해 주세요");
      return;
    }
    if (!roleIdList || roleIdList.length === 0) {
      alert("가명처리 역할을 선택해 주세요");
      return;
    }
    let success = "사용자를 추가 했습니다."
    let fail = "사용자를 추가 하는 중 오류가 발생 했습니다"
    let method = 'POST';
    if (this.props.isUpdate) {
      success = "사용자 정보를 수정 했습니다."
      fail = "사용자 정보를 수정 하는 중 오류가 발생 했습니다"
      method = 'PUT';
    }

    console.log(this.props.userInfo);
    axios({
      method: method,
      url: '/v1/user',
      data: {
        userId: userId,
        email: email,
        userName: userName,
        password: password,
        deptName: deptName,
        status: Number(status),
        roleIdList: roleIdList,
        loginPolicyId:  Number(loginPolicyId)
      },
    }).then(
        (response) => {
          console.log(response);
          alert(success);
          this.props.fetchData();
          this.props.toggle();
        },
        (error) => {
          console.log(error)
          alert(fail + '(' + error.response.status + ')')
        }
    );
  }

  deleteUser = () => {
    if (!window.confirm('사용자(' + this.props.userInfo.userName + ')를 삭제 하시겠습니까?')) {
      return;
    }
    axios({
      method: 'DELETE',
      url: '/v1/user/' + this.props.userInfo.userId,
    }).then(
        (response) => {
          console.log(response);
          alert('사용자 정보를 삭제 했습니다.');
          this.props.fetchData();
          this.props.toggle();
        },
        (error) => {
          console.log(error)
          alert('사용자 삭제에 실패 했습니다(' + error.response.status + ')')
        }
    );
  }

  renderModalFooter() {
    if (!this.props.isUpdate) {
      return (
          <>
            <Button color="primary" onClick={this.registerUser}>저장</Button>{' '}
            <Button color="secondary" onClick={this.props.toggle}>취소</Button>
          </>
      )
    } else {
      return (
          <>
            <Button color="primary" onClick={this.registerUser}>수정</Button>{' '}
            <Button color="danger" onClick={this.deleteUser}>사용자 삭제</Button>{' '}
            <Button color="secondary" onClick={this.props.toggle}>취소</Button>
          </>
      )
    }
  }

  renderLoginPolicy() {
    const {loginPolicyList} = this.state;
    return loginPolicyList.map((loginPolicy) => {
      return <option key={loginPolicy.id} value={loginPolicy.id}>{loginPolicy.name}</option>
    })
  }

  render() {
    const {roleIdList} = this.props.userInfo;
    const colStyle = {paddingRight: 0}
    return (
        <Modal
            isOpen={this.props.isOpen}
            toggle={this.props.toggle}
            className={'modal-primary'}>
          <ModalHeader toggle={this.toggle}>{this.props.isUpdate ? '사용자 정보 수정' : '사용자 추가'}</ModalHeader>
          <ModalBody>
            <Form>
              <Row>
                <Col xs="12" md="12">
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>ID(email)</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" name="email" placeholder="예)admin@email.com" value={this.props.userInfo.email} onChange={this.props.onChangeValue}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>비밀번호</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="password" name="password" value={this.props.userInfo.password} onChange={this.props.onChangeValue}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>비밀번호 확인</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="password" name="confirmPassword" value={this.props.userInfo.confirmPassword} onChange={this.props.onChangeValue}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>이름</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" name="userName" value={this.props.userInfo.userName} onChange={this.props.onChangeValue}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>소속부서(팀)</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" name="deptName" value={this.props.userInfo.deptName} onChange={this.props.onChangeValue}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>계정 상태</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="select" name="status" value={this.props.userInfo.status} onChange={this.props.onChangeValue}>
                        <option value={1}>정상</option>
                        <option value={2}>휴면</option>
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>로그인 정책</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="select" name="loginPolicyId" value={this.props.userInfo.loginPolicyId} onChange={this.props.onChangeValue}>
                        {this.renderLoginPolicy()}
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>가명처리 역할</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <FormGroup check className="checkbox">
                        <Input id="role_1" className="form-check-input" type="checkbox" name="role_1" onChange={this.props.onChangeValue} checked={roleIdList.includes(1)}/>
                        <Label className="form-check-label" htmlFor="role_1">가명처리 수행자</Label>
                      </FormGroup>
                      <FormGroup check className="checkbox">
                        <Input id="role_2" className="form-check-input" type="checkbox" name="role_2" onChange={this.props.onChangeValue} checked={roleIdList.includes(2)}/>
                        <Label check className="form-check-label" htmlFor="role_2">가명정보 결합자</Label>
                      </FormGroup>
                      <FormGroup check className="checkbox">
                        <Input id="role_3" className="form-check-input" type="checkbox" name="role_3" onChange={this.props.onChangeValue} checked={roleIdList.includes(3)}/>
                        <Label check className="form-check-label" htmlFor="role_3">적정성 검토자</Label>
                      </FormGroup>
                      <FormGroup check className="checkbox">
                        <Input id="role_4" className="form-check-input" type="checkbox" name="role_4" onChange={this.props.onChangeValue} checked={roleIdList.includes(4)}/>
                        <Label check className="form-check-label" htmlFor="role_4">사후관리 담당자</Label>
                      </FormGroup>
                      <FormGroup check className="checkbox">
                        <Input id="role_5" className="form-check-input" type="checkbox" name="role_5" onChange={this.props.onChangeValue} checked={roleIdList.includes(5)}/>
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

export default RegisterUserPopup;

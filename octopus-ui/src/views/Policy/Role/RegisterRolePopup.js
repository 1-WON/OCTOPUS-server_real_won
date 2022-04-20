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

class RegisterRolePopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roleName: props.roleInfo.roleName,
      desc: "",
      adminMenuUser: props.roleInfo.adminMenuList.includes('M_USER'),
      adminMenuAuditLog: props.roleInfo.adminMenuList.includes('M_LOG_AUDIT'),
      adminMenuSystemLog: props.roleInfo.adminMenuList.includes('M_LOG_SYSTEM'),
      adminMenuRole: props.roleInfo.adminMenuList.includes('M_POLICY_ROLE'),
      adminMenuLogin: props.roleInfo.adminMenuList.includes('M_POLICY_LOGIN'),

      //가명정보 관리대장
      userMenuWork: props.roleInfo.userMenuList.includes('M_WORK'),
      //사전준비
      userMenuPre: props.roleInfo.userMenuList.includes('M_PRE'),

      //대상선정
      userMenuTarget: props.roleInfo.userMenuList.includes('M_TARGET'),
      //위험도 측정
      userMenuRisk: props.roleInfo.userMenuList.includes('M_RISK'),
      //수준정의
      userMenuLevel: props.roleInfo.userMenuList.includes('M_LEVEL'),
      //가명처리
      userMenuPseudo: props.roleInfo.userMenuList.includes('M_PSEUDO'),
      //결합
      userMenuJoin: props.roleInfo.userMenuList.includes('M_JOIN'),

      //적정성 검토
      userMenuAssess: props.roleInfo.userMenuList.includes('M_ASSESS'),
      //활용 및 사후관리
      userMenuPost: props.roleInfo.userMenuList.includes('M_POST'),
    }
  }

  componentDidMount() {
  }

  onChangeValue = (e) => {
    switch (e.target.name) {
      case 'roleName':
      case 'desc':
        this.setState({
          [e.target.name]: e.target.value
        })
        break;
      default:
        this.setState({
          [e.target.name]: e.target.checked
        })
    }
  }

  renderModalFooter() {
    const {roleName} = this.state;
    if (!roleName) {
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
            <Button color="danger">역할 삭제</Button>{' '}
            <Button color="secondary" onClick={this.props.toggle}>취소</Button>
          </>
      )
    }
  }

  render() {
    const {
      roleName,
      desc,
      adminMenuUser,
      adminMenuAuditLog,
      adminMenuSystemLog,
      adminMenuRole,
      adminMenuLogin,
      userMenuWork,
      userMenuPre,
      userMenuTarget,
      userMenuRisk,
      userMenuLevel,
      userMenuPseudo,
      userMenuJoin,
      userMenuAssess,
      userMenuPost
    } = this.state;
    const colStyle = {paddingRight: 0}
    return (
        <Modal
            isOpen={this.props.isOpen}
            toggle={this.props.toggle}
            className={'modal-primary'}>
          <ModalHeader toggle={this.toggle}>{roleName === "" ? '역할 추가' : '역할 수정'}</ModalHeader>
          <ModalBody>
            <Form>
              <Row>
                <Col xs="12" md="12">
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>역할 이름</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" name="roleName" placeholder="예)가명정보 처리자" value={roleName} onChange={this.onChangeValue}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>역할 설명</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" name="desc" placeholder="" value={desc} onChange={this.onChangeValue}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>관리자 메뉴 권한</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <FormGroup check className="checkbox">
                        <Input id="adminMenuUser" className="form-check-input" type="checkbox" name="adminMenuUser" onChange={this.onChangeValue} checked={adminMenuUser}/>
                        <Label className="form-check-label" htmlFor="adminMenuUser">사용자 관리</Label>
                      </FormGroup>
                      <FormGroup check className="checkbox">
                        <Input id="adminMenuAuditLog" iclassName="form-check-input" type="checkbox" name="adminMenuAuditLog" onChange={this.onChangeValue} checked={adminMenuAuditLog}/>
                        <Label check className="form-check-label" htmlFor="adminMenuAuditLog">감사로그</Label>
                      </FormGroup>
                      <FormGroup check className="checkbox">
                        <Input id="adminMenuSystemLog" className="form-check-input" type="checkbox" name="adminMenuSystemLog" onChange={this.onChangeValue} checked={adminMenuSystemLog}/>
                        <Label check className="form-check-label" htmlFor="adminMenuSystemLog">시스템 로그</Label>
                      </FormGroup>
                      <FormGroup check className="checkbox">
                        <Input id="adminMenuRole" className="form-check-input" type="checkbox" name="adminMenuRole" onChange={this.onChangeValue} checked={adminMenuRole}/>
                        <Label check className="form-check-label" htmlFor="adminMenuRole">사용자 역할 관리</Label>
                      </FormGroup>
                      <FormGroup check className="checkbox">
                        <Input id="adminMenuLogin" className="form-check-input" type="checkbox" name="adminMenuLogin" onChange={this.onChangeValue} checked={adminMenuLogin}/>
                        <Label check className="form-check-label" htmlFor="adminMenuLogin">로그인 정책 관리</Label>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>사용자 메뉴 권한</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <FormGroup check className="checkbox">
                        <Input id="userMenuWork" className="form-check-input" type="checkbox" name="userMenuWork" onChange={this.onChangeValue} checked={userMenuWork}/>
                        <Label className="form-check-label" htmlFor="userMenuWork">가명정보 관리대장</Label>
                      </FormGroup>
                      <FormGroup check className="checkbox">
                        <Input id="userMenuPre" iclassName="form-check-input" type="checkbox" name="userMenuPre" onChange={this.onChangeValue} checked={userMenuPre}/>
                        <Label check className="form-check-label" htmlFor="userMenuPre">사전준비</Label>
                      </FormGroup>
                      <FormGroup check className="checkbox">
                        <Input id="userMenuTarget" className="form-check-input" type="checkbox" name="userMenuTarget" onChange={this.onChangeValue} checked={userMenuTarget}/>
                        <Label check className="form-check-label" htmlFor="userMenuTarget">대상선정</Label>
                      </FormGroup>
                      <FormGroup check className="checkbox">
                        <Input id="userMenuRisk" className="form-check-input" type="checkbox" name="userMenuRisk" onChange={this.onChangeValue} checked={userMenuRisk}/>
                        <Label check className="form-check-label" htmlFor="userMenuRisk">위험도 측정</Label>
                      </FormGroup>
                      <FormGroup check className="checkbox">
                        <Input id="userMenuLevel" className="form-check-input" type="checkbox" name="userMenuLevel" onChange={this.onChangeValue} checked={userMenuLevel}/>
                        <Label check className="form-check-label" htmlFor="userMenuLevel">가명처리 수준정의</Label>
                      </FormGroup>
                      <FormGroup check className="checkbox">
                        <Input id="userMenuPseudo" className="form-check-input" type="checkbox" name="userMenuPseudo" onChange={this.onChangeValue} checked={userMenuPseudo}/>
                        <Label check className="form-check-label" htmlFor="userMenuPseudo">가명처리</Label>
                      </FormGroup>
                      <FormGroup check className="checkbox">
                        <Input id="userMenuJoin" className="form-check-input" type="checkbox" name="userMenuJoin" onChange={this.onChangeValue} checked={userMenuJoin}/>
                        <Label check className="form-check-label" htmlFor="userMenuJoin">가명정보 결합</Label>
                      </FormGroup>
                      <FormGroup check className="checkbox">
                        <Input id="userMenuAssess" className="form-check-input" type="checkbox" name="userMenuAssess" onChange={this.onChangeValue} checked={userMenuAssess}/>
                        <Label check className="form-check-label" htmlFor="userMenuAssess">적정성 검토</Label>
                      </FormGroup>
                      <FormGroup check className="checkbox">
                        <Input id="userMenuPost" className="form-check-input" type="checkbox" name="userMenuPost" onChange={this.onChangeValue} checked={userMenuPost}/>
                        <Label check className="form-check-label" htmlFor="userMenuPost">활용 및 사후관리</Label>
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

export default RegisterRolePopup;

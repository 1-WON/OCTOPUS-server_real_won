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

    this.state = {}
  }

  componentDidMount() {
  }

  renderModalFooter() {
    const {policyInfo} = this.props;
    if (policyInfo.id === 0) {
      return (
          <>
            <Button color="primary" onClick={this.props.savePolicy}>저장</Button>{' '}
            <Button color="secondary" onClick={this.props.toggle}>취소</Button>
          </>
      )
    } else {
      return (
          <>
            <Button color="primary" onClick={this.props.savePolicy}>수정</Button>{' '}
            <Button color="danger" onClick={this.props.deletePolicy}>정책 삭제</Button>{' '}
            <Button color="secondary" onClick={this.props.toggle}>취소</Button>
          </>
      )
    }
  }

  render() {
    const colStyle = {paddingRight: 0}
    return (
        <Modal
            isOpen={this.props.isOpen}
            toggle={this.props.toggle}
            className={'modal-primary'}>
          <ModalHeader toggle={this.toggle}>{this.props.policyInfo.id === 0 ? '로그인 정책 추가' : '로그인 정책 수정'}</ModalHeader>
          <ModalBody>
            <Form>
              <Row>
                <Col xs="12" md="12">
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>정책 이름</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" name="name" placeholder="" value={this.props.policyInfo.name} onChange={this.props.onChangeValue}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>동시 접속자 처리</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="select" name="concurrentUser" value={this.props.policyInfo.concurrentUser} onChange={this.props.onChangeValue}>
                        <option value={1}>동시접속 허용</option>
                        <option value={0}>이전 접속자 로그아웃 처리</option>
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>세션 타임 아웃</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="number" min={0} name="sessionTimeout" value={this.props.policyInfo.sessionTimeout} onChange={this.props.onChangeValue}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>IP 대역</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" name="ipRange" value={this.props.policyInfo.ipRange} onChange={this.props.onChangeValue}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>로그인 실패 횟수</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" name="loginFailCount" value={this.props.policyInfo.loginFailCount} onChange={this.props.onChangeValue}/>
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

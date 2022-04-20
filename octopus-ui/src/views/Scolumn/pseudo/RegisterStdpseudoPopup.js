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
  ModalFooter,
  FormText
} from 'reactstrap';
import axios from 'axios'

class RegisterStdPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coulmnList:[]              
    }
  }

  componentDidMount() {
    this.fetchstdcolumnData()
  }

  fetchstdcolumnData() {
    this.props.setLoader(true);
    axios({
      method: 'POST',
      url: '/v1/std/column/list',
      data: {type: 1},
    }).then(
        (response) => {
          this.props.setLoader(false);
          console.log(response);
          if (response.data.columnList == null) {
            this.setState({columnList: []});
            return;
          }
          this.setState({stdcolumnList: response.data.columnList});
        },
        (error) => {
          this.props.setLoader(false);
          console.log(error)
        }
    );
  }

  registerStdcolumn = () => {
    const {coulmnnId, columnName ,attribute, dataType, dataValueType, standardEngName, standardKorName, domainId} = this.props.coulmninfo;    
    if (!columnName) {
      alert("표준 컬럼 이름을 입력해 주세요");
      return;
    }
    if (!attribute) {
      alert("개인정보 속성을 선택해 주세요");
      return;
    }
    if (!dataType) {
      alert("데이터 유형을 선택해 주세요");
      return;
    }
    if (!dataValueType) {
      alert("데이터 값 유형을 선택해 주세요");
      return;
    }    
    if (!standardEngName) {
      alert("표준 영문 이름을 입력해 주세요");
      return;
    }
    if (!standardKorName) {
      alert("표준 한글 이름을 입력해 주세요");
      return;
    }
    if (!domainId) {
      alert("도메인 id를 입력해 주세요");
      return;
    }
    let success = "표준 컬럼을 추가 했습니다."
    let fail = "표준컬럼을 추가 하는 중 오류가 발생 했습니다"
    let method = 'POST';
    if (this.props.isUpdate) {
      success = "표준 컬럼 정보를 수정 했습니다."
      fail = "표준컬럼 정보를 수정 하는 중 오류가 발생 했습니다"
      method = 'PUT';
    }

    console.log(this.props.coulmninfo);
    axios({
      method: method,
      url: '/v1/std/column',
      data: {
        coulmnnId : Number(coulmnnId),
        columnName : columnName,
        attribute : Number(attribute),
	      dataType  : Number(dataType),     
	      dataValueType  : Number(dataValueType), 
	      standardEngName : standardEngName,
	      standardKorName : standardKorName,
	      domainId   : Number(domainId),              
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
  Deletestd = () => {
    if (!window.confirm('표준컬럼  ( ' + this.props.coulmninfo.columnName + ' )를 삭제 하시겠습니까?')) {
      return;
    }
    axios({
      method: 'DELETE',
      url: '/v1/std/column/'  + this.props.coulmninfo.coulmnnId
    }).then(
        (response) => {
          console.log(response);
          alert('표준 컬럼을 삭제 했습니다.');
          this.props.fetchData();
          this.props.toggle();
        },
        (error) => {
          alert(error.toString())
          console.log(error)
          alert('Deletestdcolumn 함수에서 발생한 에러입니다.')
          alert('사용자 삭제에 실패 했습니다(' + error.response.status + ')')          
        }
    );
  }
  renderModalFooter() { 
    if (!this.props.isUpdate) {
      return (
          <>
            <Button color="primary" onClick={this.registerStdcolumn}>저장</Button>{' '}
            <Button color="secondary" onClick={this.props.toggle}>취소</Button>
          </>
      )
    } else {
      return (
          <>
            <Button color="primary" onClick={this.registerStdcolumn}>수정</Button>{' '}
            <Button color="danger" onClick={this.Deletestd}>표준 컬럼 삭제</Button>{' '}
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
    const colStyle = {paddingRight: 0}
    return (
        <Modal
            isOpen={this.props.isOpen}
            toggle={this.props.toggle}
            className={'modal-primary'}>
          <ModalHeader toggle={this.toggle}>{this.props.isUpdate ? '표준 컬럼 정의 수정' : '표준 컬럼 정의 추가 '}</ModalHeader>
          <ModalBody>
            <Form>
              <Row>
                <Col xs="12" md="12">
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>표준컬럼 이름</Label>
                    </Col>
                    <Col xs="12" md="9">
                    <Input type="text" name="columnName" placeholder="" value={this.props.coulmninfo.columnName} onChange={this.props.onChangeValue}/>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>개인정보 속성</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="select" name="attribute" value={this.props.coulmninfo.attribute} onChange={this.props.onChangeValue}>    
                        <option value={0}>개인정보 속성을 선택해주세요</option>                    
                        <option value={1}>식별자</option>
                        <option value={2}>준식별자</option>
                        <option value={3}>일반</option>
                      </Input>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>데이터 유형</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="select" name="dataType" value={this.props.coulmninfo.dataType} onChange={this.props.onChangeValue}>     
                        <option value={0}>데이터유형을 선택해주세요</option>                    
                        <option value={1}>문자</option>
                        <option value={2}>숫자</option>
                        
                      </Input>
                    </Col>
                  </FormGroup>                
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>데이터 값 유형 </Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="select" name="dataValueType" value={this.props.coulmninfo.dataValueType} onChange={this.props.onChangeValue}>                        
                        <option value={0}>데이터 값 유형을 선택해주세요</option>   
                        <option value={1}>수치형</option>
                        <option value={2}>범주형</option>
                        <option value={3}>일반</option>
                      </Input>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}> 표준 영문 이름 </Label>
                    </Col>
                    <Col xs="12" md="9">
                    <Input type="text" name="standardEngName" placeholder="" value={this.props.coulmninfo.standardEngName} onChange={this.props.onChangeValue}/>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}> 표준 한글 이름 </Label>
                    </Col>
                    <Col xs="12" md="9">
                    <Input type="text" name="standardKorName" placeholder="" value={this.props.coulmninfo.standardKorName} onChange={this.props.onChangeValue}/>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}> 도메인 id </Label>
                    </Col>
                    <Col xs="12" md="9">
                    <Input type="text" name="domainId" placeholder="" value={this.props.coulmninfo.domainId} onChange={this.props.onChangeValue}/>
                    </Col>
                  </FormGroup>

                  {/* <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}> 도메인 이름 </Label>
                    </Col>
                    <Col xs="12" md="9">
                    <Input type="text" name="domainName" placeholder="도메인 이름을 입력해주세요." value={this.props.coulmninfo.domainName} onChange={this.props.onChangeValue}/>
                    </Col>
                  </FormGroup> */}
 


        
                  



 {/*
                  // <FormGroup row>
                  //   <Col md="3" style={colStyle}>
                  //     <Label style={{margin: 0, verticalAlign: 'middle'}}>비밀번호 확인</Label>
                  //   </Col>
                  //   <Col xs="12" md="9">
                  //     <Input type="password" name="confirmPassword" value={this.props.userInfo.confirmPassword} onChange={this.props.onChangeValue}/>
                  //   </Col>
                  // </FormGroup>
                  // <FormGroup row>
                  //   <Col md="3" style={colStyle}>
                  //     <Label style={{margin: 0, verticalAlign: 'middle'}}>이름</Label>
                  //   </Col>
                  //   <Col xs="12" md="9">
                  //     <Input type="text" name="userName" value={this.props.userInfo.userName} onChange={this.props.onChangeValue}/>
                  //   </Col>
                  // </FormGroup>
                  // <FormGroup row>
                  //   <Col md="3" style={colStyle}>
                  //     <Label style={{margin: 0, verticalAlign: 'middle'}}>소속부서(팀)</Label>
                  //   </Col>
                  //   <Col xs="12" md="9">
                  //     <Input type="text" name="deptName" value={this.props.userInfo.deptName} onChange={this.props.onChangeValue}/>
                  //   </Col>
                  // </FormGroup>
                  // <FormGroup row>
                  //   <Col md="3" style={colStyle}>
                  //     <Label style={{margin: 0, verticalAlign: 'middle'}}>계정 상태</Label>
                  //   </Col>
                  //   <Col xs="12" md="9">
                  //     <Input type="select" name="status" value={this.props.userInfo.status} onChange={this.props.onChangeValue}>
                  //       <option value={1}>정상</option>
                  //       <option value={2}>휴면</option>
                  //     </Input>
                  //   </Col>
                  // </FormGroup>
                  // <FormGroup row>
                  //   <Col md="3" style={colStyle}>
                  //     <Label style={{margin: 0, verticalAlign: 'middle'}}>로그인 정책</Label>
                  //   </Col>
                  //   <Col xs="12" md="9">
                  //     <Input type="select" name="loginPolicyId" value={this.props.userInfo.loginPolicyId} onChange={this.props.onChangeValue}>
                  //       {this.renderLoginPolicy()}
                  //     </Input>
                  //   </Col>
                  // </FormGroup>
                  
                  // <FormGroup row>
                  //   <Col md="3" style={colStyle}>
                  //     <Label style={{margin: 0, verticalAlign: 'middle'}}>가명처리 역할</Label>
                  //   </Col>





                    
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
                  </FormGroup> */}
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

export default RegisterStdPopup;

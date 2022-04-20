import React, {Component} from 'react';
import {
  Button, ButtonDropdown,
  Card, CardBody, CardFooter,
  CardHeader,
  Col, DropdownItem, DropdownMenu, DropdownToggle,
  Form,
  FormGroup,
  Input, Label,
  Row
} from 'reactstrap';
import axios from "axios";
import Grid from "@toast-ui/react-grid";
import 'tui-grid/dist/tui-grid.css';
import RegisterPolicyLoginPopup from "./RegisterPolicyLoginPopup";

class CustomTextEditor {
  constructor(props) {
    console.log(props);
    const el = document.createElement('input');
    const {onChange} = props.columnInfo.editor.options;

    el.type = 'text';
    el.value = String(props.value);
    el.onchange = onChange;
    el.rowKey = props.rowKey;
    el.name = props.columnInfo.name;

    this.el = el;
  }

  getElement() {
    return this.el;
  }

  getValue() {
    return this.el.value;
  }

  mounted() {
    this.el.select();
  }
}

class PolicyLoginGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      status: "",
      isRegisterPolicyModal: false,
      policyList: [],
      loginPolicyList: [],
      policyInfo: {},
      isOpen: false,
      isPasswordUse: '1',
      passwordValidPeriod: '1',
      isPasswordValidPeriodUse: '1',
      passwordExpireAlarm: '1',
      isPasswordExpireAlarmUse: '1',
      isPasswordRuleUse: '1',
      passwordLen: '8',
      passwordSeq: '3',
      passwordIdentity: '3',
      isPasswordSeqProhibition: '0',
      oldPasswordUseCount: '3',
      isOldPasswordProhibition: '0',

      id: 0,
      name: '',
      concurrentUser: 0,
      sessionTimeout: 0,
      ipRange: '',
      ipRange2: '',
      loginFailCount: 0
    }
  }
  gridRef = React.createRef();
  componentDidMount() {
    this.fetchData();
    this.fetchLoginPolicyData();
  }

 

  fetchData() {
    this.props.setLoader(true);
    axios({
      method: 'POST',
      url: '/v1/common_policy/list',
      data: {type: 1},
    }).then(
        (response) => {
          this.props.setLoader(false);
          console.log(response);
          if (response.data.policyList == null) {
            return;
          }
          response.data.policyList.forEach(policy => {
            this.setState({
              [policy.key]: policy.value
            })
          })
        },
        (error) => {
          this.props.setLoader(false);
          console.log(error)
        }
    );
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

  putPolicy = () => {
    const {
      isPasswordUse,
      passwordValidPeriod,
      isPasswordValidPeriodUse,
      passwordExpireAlarm,
      isPasswordExpireAlarmUse,
      isPasswordRuleUse,
      passwordLen,
      passwordSeq,
      passwordIdentity,
      isPasswordSeqProhibition,
      oldPasswordUseCount,
      isOldPasswordProhibition
    } = this.state;
    this.props.setLoader(true);
    axios({
      method: 'POST',
      url: '/v1/common_policy',
      data: {
        isPasswordUse,
        passwordValidPeriod,
        isPasswordValidPeriodUse,
        passwordExpireAlarm,
        isPasswordExpireAlarmUse,
        isPasswordRuleUse,
        passwordLen,
        passwordSeq,
        passwordIdentity,
        isPasswordSeqProhibition,
        oldPasswordUseCount,
        isOldPasswordProhibition,
        policyType: 1
      },
    }).then(
        (response) => {
          this.props.setLoader(false);
          console.log(response);
          alert('비밀번호 정책을 적용 했습니다.')
          this.fetchData();
        },
        (error) => {
          this.props.setLoader(false);
          console.log(error)
        }
    );
  }

  putLoginPolicy = () => {
    const {policyInfo} = this.state;
    if (policyInfo.name === '') {
      alert('정책 이름을 입력해 주세요');
      return;
    }
    this.props.setLoader(true);
    axios({
      method: 'POST',
      url: '/v1/login_policy',
      data: policyInfo,
    }).then(
        (response) => {
          this.props.setLoader(false);
          console.log(response);
          alert('로그인 정책을 수정 했습니다.')
          this.setState({isRegisterPolicyModal: !this.state.isRegisterPolicyModal}, this.fetchLoginPolicyData);
        },
        (error) => {
          this.props.setLoader(false);
          console.log(error)
        }
    );
  }

  deletePolicy = () => {
    const {policyInfo} = this.state;
    this.props.setLoader(true);
    axios({
      method: 'DELETE',
      url: '/v1/login_policy',
      data: {id: policyInfo.id},
    }).then(
        (response) => {
          this.props.setLoader(false);
          console.log(response);
          alert('로그인 정책을 삭제 했습니다.')
          this.setState({isRegisterPolicyModal: !this.state.isRegisterPolicyModal}, this.fetchLoginPolicyData);
        },
        (error) => {
          this.props.setLoader(false);
          console.log(error)
        }
    );
  }


  onClickCell = (e) => {
    let {loginPolicyList} = this.state;
    const rowKey = e.rowKey;
    if (rowKey === undefined) {
      return;
    }
    const policyInfo = loginPolicyList[rowKey];
    switch (e.columnName) {
      case 'name':
        this.setState({policyInfo}, this.toggleRegisterPolicy);
        break;
      default:
        break;
    }
  }

  onChangeValue = (e) => {
    const {policyInfo} = this.state;
    switch (e.target.name) {
      case 'concurrentUser':
      case 'sessionTimeout':
      case 'loginFailCount':
        policyInfo[e.target.name] = Number(e.target.value);
        break;
      default:
        policyInfo[e.target.name] = e.target.value;
    }
    console.log(policyInfo);
    this.setState({policyInfo});
  }

  onChangePasswordPolicy = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  columns = [
    {
      header: '정책 이름',
      name: 'name',
      width: 180,
      formatter: ({row}) => {
        return '<div style="color: blue; text-decoration: underline; cursor: pointer;">' + row.name + '</div>'
      },
      filter: 'text'
    },
    {
      header: '동시 접속자 처리',
      name: 'concurrentUser',
      width: 200,
      formatter: ({row}) => {
        switch (row.concurrentUser) {
          case 0:
            return '이전 접속자 로그아웃 처리';
          case 1:
            return '동시접속 허용';
        }
      },
    },
    {
      header: '세션 타임 아웃',
      name: 'sessionTimeout',
      width: 200,
    },
    {
      header: 'IP 대역',
      name: 'ipRange',
      width: 250,
      align: 'center',
    },
    {
      header: '로그인 실패 횟수 제한',
      name: 'loginFailCount',
      width: 200,
      align: 'center',
    },
    {
      header: '생성일',
      name: 'createdAt',
      width: 180,
      align: 'center',
    },
  ];

  toggleRegisterPolicy = (isUpdate = true) => {
    if (!isUpdate) {
      this.setState({
        isRegisterPolicyModal: !this.state.isRegisterPolicyModal, policyInfo: {
          id: 0,
          name: '',
          concurrentUser: 1,
          sessionTimeout: 0,
          ipRange: '0.0.0.0',
          ipRange2: '',
          loginFailCount: 0
        }
      })
    } else {
      this.setState({isRegisterPolicyModal: !this.state.isRegisterPolicyModal})
    }
  }

  toggle = () => {
    this.setState({isOpen: !this.state.isOpen})
  }

  renderContent() {
    let {loginPolicyList} = this.state;
    return (
        <>
          <Grid
              ref={this.gridRef}
              data={loginPolicyList}
              rowHeaders={['rowNum']}
              rowHeight={50}
              //bodyHeight={window.innerHeight - 350}
              columns={this.columns}
              columnOptions={{
                resizable: true,
              }}
              onClick={this.onClickCell}
          />
        </>
    );
  }

  downloadExcel = () => {
    this.gridRef.current.getInstance().export('xlsx', {fileName: '로그인 정책 리스트'});
  }


  onKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  render() {
    const {
      isOpen,
      isRegisterPolicyModal,
      policyInfo,
      isPasswordUse,
      passwordValidPeriod,
      isPasswordValidPeriodUse,
      passwordExpireAlarm,
      isPasswordExpireAlarmUse,
      isPasswordRuleUse,
      passwordLen,
      passwordSeq,
      passwordIdentity,
      isPasswordSeqProhibition,
      oldPasswordUseCount,
      isOldPasswordProhibition
    } = this.state;
    return (
        <div className="animated fadeIn" onKeyPress={this.onKeyPress}>
          <Row>
            <Col xs="12" lg="12">
              <Card style={{marginBottom: 15 + 'px'}}>
                <CardHeader>
                  <i className="fa fa-align-justify"/>비밀번호 정책
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col md="7">
                      <Row>
                        <Col md="3">
                          <Label style={{margin: 0, verticalAlign: 'middle', fontWeight: 'bold'}}>사용여부</Label>
                        </Col>
                        <Col md="9">
                          <Form inline>
                            <FormGroup className="checkbox pr-4">
                              <Input id="role_1" className="form-check-input" type="radio" name="isPasswordUse" value='1' onChange={this.onChangePasswordPolicy}
                                     checked={isPasswordUse === '1'}/>
                              <Label className="form-check-label" htmlFor="role_1">사용</Label>
                            </FormGroup>
                            <FormGroup className="checkbox">
                              <Input id="role_1" className="form-check-input" type="radio" name="isPasswordUse" value='0' onChange={this.onChangePasswordPolicy}
                                     checked={isPasswordUse === '0'}/>
                              <Label className="form-check-label" htmlFor="role_1">사용하지 않음</Label>
                            </FormGroup>
                          </Form>
                        </Col>
                      </Row>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="7">
                      <Row>
                        <Col md="3">
                          <Label style={{margin: 0, verticalAlign: 'middle', fontWeight: 'bold'}}>비밀번호 유효기간</Label>
                        </Col>
                        <Col md="9">
                          <Form inline>
                            <FormGroup className="checkbox pr-4">
                              <Input id="role_1" className="form-check-input" type="radio" name="isPasswordValidPeriodUse" value={'1'}
                                     onChange={this.onChangePasswordPolicy} checked={isPasswordValidPeriodUse === '1'}/>
                              <Label className="form-check-label pr-1" htmlFor="role_1">사용</Label>
                              <Input className="form-check-input" type="number" min={1} name="passwordValidPeriod" value={passwordValidPeriod}
                                     onChange={this.onChangePasswordPolicy} style={{width: '100px', height: '25px'}}/>
                              <Label>일(1~365 이내)</Label>
                            </FormGroup>
                            <FormGroup className="checkbox">
                              <Input id="role_1" className="form-check-input" type="radio" name="isPasswordValidPeriodUse" value={'0'}
                                     onChange={this.onChangePasswordPolicy}
                                     checked={isPasswordValidPeriodUse === '0'}/>
                              <Label className="form-check-label" htmlFor="role_1">사용하지 않음(제한없음)</Label>
                            </FormGroup>
                          </Form>
                        </Col>
                      </Row>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="7">
                      <Row>
                        <Col md="3">
                          <Label style={{margin: 0, verticalAlign: 'middle', fontWeight: 'bold'}}>비밀번호 기간 만료시 알림</Label>
                        </Col>
                        <Col md="9">
                          <Form inline>
                            <FormGroup className="checkbox pr-4">
                              <Input id="role_1" className="form-check-input" type="radio" name="isPasswordExpireAlarmUse" value={'1'}
                                     onChange={this.onChangePasswordPolicy}
                                     checked={isPasswordExpireAlarmUse === '1'}/>
                              <Label className="form-check-label pr-1" htmlFor="role_1">사용</Label>
                              <Input className="form-check-input" type="number" min={1} name="passwordExpireAlarm" value={passwordExpireAlarm}
                                     onChange={this.onChangePasswordPolicy}
                                     style={{width: '100px', height: '25px'}}/>
                              <Label>일전(1~7 이내)</Label>
                            </FormGroup>
                            <FormGroup className="checkbox" style={{paddingLeft: '5px'}}>
                              <Input id="role_1" className="form-check-input" type="radio" name="isPasswordExpireAlarmUse" value={'0'}
                                     onChange={this.onChangePasswordPolicy}
                                     checked={isPasswordExpireAlarmUse === '0'}/>
                              <Label className="form-check-label" htmlFor="role_1">사용하지 않음(제한없음)</Label>
                            </FormGroup>
                          </Form>
                        </Col>
                      </Row>
                    </Col>
                  </FormGroup>
                  <hr/>
                  <FormGroup row>
                    <Col md="7">
                      <Row>
                        <Col md="3">
                          <Label style={{margin: 0, verticalAlign: 'middle', fontWeight: 'bold'}}>비밀번호 생성 규칙</Label>
                        </Col>
                        <Col md="9">
                          <Form inline>
                            <FormGroup className="checkbox pr-4">
                              <Input id="role_1" className="form-check-input" type="radio" name="isPasswordRuleUse" value={'1'}
                                     onChange={this.onChangePasswordPolicy}
                                     checked={isPasswordRuleUse === '1'}/>
                              <Label className="form-check-label" htmlFor="role_1">사용</Label>
                            </FormGroup>
                            <FormGroup className="checkbox">
                              <Input id="role_1" className="form-check-input" type="radio" name="isPasswordRuleUse" value={'0'}
                                     onChange={this.onChangePasswordPolicy}
                                     checked={isPasswordRuleUse === '0'}/>
                              <Label className="form-check-label" htmlFor="role_1">사용하지 않음</Label>
                            </FormGroup>
                          </Form>
                        </Col>
                      </Row>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="7">
                      <Row>
                        <Col md="3"></Col>
                        <Col md="9">
                          <Form inline>
                            <FormGroup className="checkbox pr-4">
                              <Input id="role_1" className="form-check-input" type="radio" name="passwordLen" value={'8'} onChange={this.onChangePasswordPolicy}
                                     checked={passwordLen === '8'}/>
                              <Label className="form-check-label" htmlFor="role_1">8자이상의 문자로 3종류(영문자, 숫자, 특수문자 중)이상 포함</Label>
                            </FormGroup>
                          </Form>
                        </Col>
                      </Row>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="7">
                      <Row>
                        <Col md="3"></Col>
                        <Col md="9">
                          <Form inline>
                            <FormGroup className="checkbox pr-4">
                              <Input id="role_1" className="form-check-input" type="radio" name="passwordLen" value={'10'} onChange={this.onChangePasswordPolicy}
                                     checked={passwordLen === '10'}/>
                              <Label className="form-check-label" htmlFor="role_1">10자 이상의 문자로 2종류(영문자, 숫자, 특수문자 중)이상 포함</Label>
                            </FormGroup>
                          </Form>
                        </Col>
                      </Row>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="7">
                      <Row>
                        <Col md="3"></Col>
                        <Col md="9">
                          <Form inline>
                            <FormGroup className="checkbox pr-4">
                              <Input id="role_1" className="form-check-input" type="checkbox" name="isPasswordSeqProhibition"
                                     value={isPasswordSeqProhibition === '1' ? '0' : '1'}
                                     onChange={this.onChangePasswordPolicy}
                                     checked={isPasswordSeqProhibition === '1'}/>
                              <Label className="form-check-label pr-1" htmlFor="role_1">연속</Label>
                              <Input className="form-check-input" type="number" min={3} name="passwordSeq" value={passwordSeq}
                                     onChange={this.onChangePasswordPolicy}
                                     style={{width: '100px', height: '25px'}}/>
                              <Label>개(최소 3개이상),동일</Label>
                              <Input className="form-check-input" type="number" min={3} name="passwordIdentity" value={passwordIdentity}
                                     onChange={this.onChangePasswordPolicy}
                                     style={{width: '100px', height: '25px'}}/>
                              <Label>개(최소 3개이상) 문자 숫자 사용 금지</Label>
                            </FormGroup>
                          </Form>
                        </Col>
                      </Row>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="7">
                      <Row>
                        <Col md="3"></Col>
                        <Col md="9">
                          <Form inline>
                            <FormGroup className="checkbox pr-4">
                              <Input id="role_1" className="form-check-input" type="checkbox" name="isOldPasswordProhibition"
                                     value={isOldPasswordProhibition === '1' ? '0' : '1'}
                                     onChange={this.onChangePasswordPolicy}
                                     checked={isOldPasswordProhibition === '1'}/>
                              <Label className="form-check-label pr-1" htmlFor="role_1">이전</Label>
                              <Input className="form-check-input" type="number" min={3} name="oldPasswordUseCount" value={oldPasswordUseCount}
                                     onChange={this.onChangePasswordPolicy}
                                     style={{width: '100px', height: '25px'}}/>
                              <Label>회(3회 이상) 비밀번호 사용 불가</Label>
                            </FormGroup>
                          </Form>
                        </Col>
                      </Row>
                    </Col>
                  </FormGroup>
                </CardBody>
                <CardFooter>
                  <Button size="sm" color="primary" onClick={this.putPolicy} style={{float: 'right'}}>
                    <i className="fa fa-dot-circle-o"/>적용</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"/>로그인 정책
                  <ButtonDropdown isOpen={isOpen} toggle={this.toggle} style={{float: 'right'}}>
                    <DropdownToggle caret color="primary">
                      <i className="fa fa-list"/>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => this.toggleRegisterPolicy(false)}>
                        <i className="fa fa-user"/>정책 추가
                      </DropdownItem>
                      <DropdownItem onClick={this.downloadExcel}>
                        <i className="fa fa-table"/>엑셀로 저장
                      </DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                </CardHeader>
                {this.renderContent()}
                <RegisterPolicyLoginPopup
                    isOpen={isRegisterPolicyModal}
                    toggle={this.toggleRegisterPolicy}
                    onChangeValue={this.onChangeValue}
                    policyInfo={policyInfo}
                    savePolicy={this.putLoginPolicy}
                    deletePolicy={this.deletePolicy}
                    {...this.props}/>
              </Card>
            </Col>
          </Row>
        </div>
    );
  }
}

export default PolicyLoginGrid;

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
      policyInfo: {},
      isOpen: false,
      passwordLen8: true,
      passwordLen10: false
    }
  }

  componentDidMount() {
    const policyList = [
      {
        policyName: '가명처리 로그인 정책',
        sameTimeLogin: '이전 접속자 로그아웃 처리',
        sessionTimeOut: '제한 없음',
        ipRange: '192.168.1.9',
        loginFailCount: 3,
        createdAt: '2021-11-11 15:30:14'
      }
    ];
    this.setState({policyList});
  }

  onClickCell = (e) => {
    let {policyList} = this.state;
    const rowKey = e.rowKey;
    if (rowKey === undefined) {
      return;
    }
    const userInfo = policyList[rowKey];
    switch (e.columnName) {
      case 'email':
        this.setState({userInfo}, this.toggleRegisterUser);
        break;
      default:
        break;
    }
  }

  columns = [
    {
      header: '정책 이름',
      name: 'policyName',
      width: 180,
      formatter: ({row}) => {
        return '<div style="color: blue; text-decoration: underline; cursor: pointer;">' + row.policyName + '</div>'
      },
      filter: 'text'
    },
    {
      header: '동시 접속자 처리',
      name: 'sameTimeLogin',
      width: 200,
    },
    {
      header: '세션 타임 아웃',
      name: 'sessionTimeOut',
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
    // if (!isUpdate) {
    //   this.setState({isRegisterPolicyModal: !this.state.isRegisterPolicyModal, policyInfo: {}})
    // } else {
    //   this.setState({isRegisterPolicyModal: !this.state.isRegisterPolicyModal})
    // }
  }

  toggle = () => {
    this.setState({isOpen: !this.state.isOpen})
  }

  renderContent() {
    let {policyList} = this.state;
    return (
        <>
          <Grid
              data={policyList}
              rowHeaders={['rowNum']}
              rowHeight={50}
              bodyHeight={window.innerHeight - 350}
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

  }

  onChangeValue = (e) => {
    switch (e.target.name) {
      case 'passwordLen8':
      case 'passwordLen10':
        this.setState({passwordLen8: !this.state.passwordLen8, passwordLen10: !this.state.passwordLen10})
        break;
      default:
        this.setState({
          [e.target.name]: e.target.value
        })
    }
  }

  onKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  render() {
    const {isOpen, isRegisterPolicyModal, policyInfo, passwordLen8, passwordLen10} = this.state;
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
                              <Input id="role_1" className="form-check-input" type="radio" name="role_1" onChange={this.onChangeValue} checked={true}/>
                              <Label className="form-check-label" htmlFor="role_1">사용</Label>
                            </FormGroup>
                            <FormGroup className="checkbox">
                              <Input id="role_1" className="form-check-input" type="radio" name="role_1" onChange={this.onChangeValue}/>
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
                              <Input id="role_1" className="form-check-input" type="radio" name="role_1" onChange={this.onChangeValue} checked={true}/>
                              <Label className="form-check-label pr-1" htmlFor="role_1">사용</Label>
                              <Input className="form-check-input" type="number" min={1} name="validPeriod" onChange={this.onChangeValue} style={{width: '100px', height: '25px'}}/>
                              <Label>일(1~365 이내)</Label>
                            </FormGroup>
                            <FormGroup className="checkbox">
                              <Input id="role_1" className="form-check-input" type="radio" name="role_1" onChange={this.onChangeValue}/>
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
                              <Input id="role_1" className="form-check-input" type="radio" name="role_1" onChange={this.onChangeValue} checked={true}/>
                              <Label className="form-check-label pr-1" htmlFor="role_1">사용</Label>
                              <Input className="form-check-input" type="number" min={1} name="validPeriod" onChange={this.onChangeValue} style={{width: '100px', height: '25px'}}/>
                              <Label>일전(1~7 이내)</Label>
                            </FormGroup>
                            <FormGroup className="checkbox" style={{paddingLeft: '5px'}}>
                              <Input id="role_1" className="form-check-input" type="radio" name="role_1" onChange={this.onChangeValue}/>
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
                              <Input id="role_1" className="form-check-input" type="radio" name="role_1" onChange={this.onChangeValue} checked={true}/>
                              <Label className="form-check-label" htmlFor="role_1">사용</Label>
                            </FormGroup>
                            <FormGroup className="checkbox">
                              <Input id="role_1" className="form-check-input" type="radio" name="role_1" onChange={this.onChangeValue}/>
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
                              <Input id="role_1" className="form-check-input" type="radio" name="passwordLen8" onChange={this.onChangeValue} checked={passwordLen8}/>
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
                              <Input id="role_1" className="form-check-input" type="radio" name="passwordLen10" onChange={this.onChangeValue} checked={passwordLen10}/>
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
                              <Input id="role_1" className="form-check-input" type="checkbox" name="role_1" onChange={this.onChangeValue} checked={true}/>
                              <Label className="form-check-label pr-1" htmlFor="role_1">연속</Label>
                              <Input className="form-check-input" type="number" min={3} name="validPeriod" onChange={this.onChangeValue} style={{width: '100px', height: '25px'}}/>
                              <Label>개(최소 3개이상),동일</Label>
                              <Input className="form-check-input" type="number" min={3} name="validPeriod" onChange={this.onChangeValue} style={{width: '100px', height: '25px'}}/>
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
                              <Input id="role_1" className="form-check-input" type="checkbox" name="role_1" onChange={this.onChangeValue} checked={true}/>
                              <Label className="form-check-label pr-1" htmlFor="role_1">이전</Label>
                              <Input className="form-check-input" type="number" min={3} name="validPeriod" onChange={this.onChangeValue} style={{width: '100px', height: '25px'}}/>
                              <Label>회(3회 이상) 비밀번호 사용 불가</Label>
                            </FormGroup>
                          </Form>
                        </Col>
                      </Row>
                    </Col>
                  </FormGroup>
                </CardBody>
                <CardFooter>
                  <Button size="sm" color="primary" onClick={this.fetchData} style={{float: 'right'}}>
                    <i className="fa fa-dot-circle-o"/>적용</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"/>로그인 정책
                  <ButtonDropdown isOpen={isOpen} toggle={this.toggle} style={{float:'right'}}>
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
                {
                  isRegisterPolicyModal ?
                      <RegisterPolicyLoginPopup
                          isOpen={isRegisterPolicyModal}
                          toggle={this.toggleRegisterPolicy}
                          fetchData={this.fetchData}
                          userInfo={policyInfo}
                          {...this.props}/> : null
                }
              </Card>
            </Col>
          </Row>
        </div>
    );
  }
}

export default PolicyLoginGrid;

import React, {Component} from 'react';
import {
  Button, ButtonDropdown,
  Card,
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
import RegisterRolePopup from "./RegisterRolePopup";

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

class RoleGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      status: "",
      isRegisterRoleModal: false,
      roleList: [],
      roleInfo: {},
      isOpen: false
    }
  }

  gridRef = React.createRef();

  componentDidMount() {
    const roleList = [
      {
        roleName: '감사 관리자',
        adminMenu: '감사로그/시스템로그',
        userMenu: '-',
        desc: '',
        createdAt: "2021-11-12 13:05:05",
        adminMenuList: ['M_LOG_AUDIT','M_LOG_SYSTEM'],
        userMenuList: []
      },
      {
        roleName: '사용자 관리자',
        adminMenu: '사용자 관리/사용자 역할 관리/로그인 정책 관리',
        userMenu: '-',
        desc: '',
        createdAt: "2021-11-12 13:05:05",
        adminMenuList: ['M_USER','M_POLICY_ROLE','M_POLICY_LOGIN'],
        userMenuList: []
      },
      {
        roleName: '가명정보 사용자',
        adminMenu: '-',
        userMenu: '가명정보 관리대장/사전준비/활용 및 사후 관리',
        desc: '',
        createdAt: "2021-11-12 13:05:05",
        adminMenuList: [],
        userMenuList: ['M_WORK','M_PRE','M_POST']
      },
      {
        roleName: '가명처리 수행자',
        adminMenu: '-',
        userMenu: '가명정보 관리대장/가명처리',
        desc: '',
        createdAt: "2021-11-12 13:05:05",
        adminMenuList: [],
        userMenuList: ['M_WORK','M_PSEUDO']
      },
      {
        roleName: '가명정보 결합자',
        adminMenu: '-',
        userMenu: '가명정보 관리대장/가명정보 결합',
        desc: '',
        createdAt: "2021-11-12 13:05:05",
        adminMenuList: [],
        userMenuList: ['M_WORK','M_JOIN']
      },
      {
        roleName: '적정성 검토자',
        adminMenu: '-',
        userMenu: '가명정보 관리대장/적정성 검토',
        desc: '',
        createdAt: "2021-11-12 13:05:05",
        adminMenuList: [],
        userMenuList: ['M_WORK','M_ASSESS']
      }
    ];
    this.setState({roleList});
  }

  onClickCell = (e) => {
    let {roleList} = this.state;
    const rowKey = e.rowKey;
    if (rowKey === undefined) {
      return;
    }
    const roleInfo = roleList[rowKey];
    switch (e.columnName) {
      case 'roleName':
        this.setState({roleInfo}, this.toggleRegisterRole);
        break;
      default:
        break;
    }
  }

  columns = [
    {
      header: '역할 이름',
      name: 'roleName',
      width: 180,
      formatter: ({row}) => {
        return '<div style="color: blue; text-decoration: underline; cursor: pointer;">' + row.roleName + '</div>'
      },
      filter: 'text'
    },
    {
      header: '관리자 접근 메뉴',
      name: 'adminMenu',
      width: 280,
      filter: 'text',
      align: 'center'
    },
    {
      header: '사용자 접근 메뉴',
      name: 'userMenu',
      width: 280,
      filter: 'text',
      align: 'center'
    },
    {
      header: '역할 설명',
      name: 'desc',
      width: 280,
    },
    {
      header: '생성일',
      name: 'createdAt',
      width: 180,
      align: 'center',
    },
  ];

  toggleRegisterRole = (isUpdate = true) => {
    if (!isUpdate) {
      this.setState({
        isRegisterRoleModal: !this.state.isRegisterRoleModal, roleInfo: {
          roleName: "",
          adminMenuList: [],
          userMenuList: [],
          desc: ""
        }
      })
    } else {
      this.setState({isRegisterRoleModal: !this.state.isRegisterRoleModal})
    }
  }

  toggle = () => {
    this.setState({isOpen: !this.state.isOpen})
  }

  renderContent() {
    let {roleList} = this.state;
    return (
        <>
          <Grid
              ref={this.gridRef}
              data={roleList}
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
    this.gridRef.current.getInstance().export('xlsx', {fileName: '사용자 역할 리스트'});
  }

  render() {
    const {isOpen, isRegisterRoleModal, roleInfo} = this.state;
    return (
        <div className="animated fadeIn">
          <Row>
            <Col xs="12" lg="12">
              <Card style={{marginBottom: 15 + 'px'}}>
                <CardHeader>
                  <Form inline>
                    <FormGroup className="pr-3">
                      <Input type="text" id="exampleInputEmail2" placeholder="역할이름 입력" style={{width: 180 + 'px'}}/>
                    </FormGroup>
                    <Button size="sm" color="primary" onClick={this.fetchData}>
                      <i className="fa fa-dot-circle-o"/>검색</Button>
                    <FormGroup style={{marginLeft: 'auto', marginRight: 0}}>
                      <ButtonDropdown isOpen={isOpen} toggle={this.toggle}>
                        <DropdownToggle caret color="primary">
                          <i className="fa fa-list"/>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={() => this.toggleRegisterRole(false)}>
                            <i className="fa fa-user"/>역할 추가
                          </DropdownItem>
                          <DropdownItem onClick={this.downloadExcel}>
                            <i className="fa fa-table"/>엑셀로 저장
                          </DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </FormGroup>
                  </Form>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"/>사용자 역할
                </CardHeader>
                {this.renderContent()}
                {
                  isRegisterRoleModal ?
                      <RegisterRolePopup
                          isOpen={isRegisterRoleModal}
                          toggle={this.toggleRegisterRole}
                          fetchData={this.fetchData}
                          roleInfo={roleInfo}
                          {...this.props}/> : null
                }
              </Card>
            </Col>
          </Row>
        </div>
    );
  }
}

export default RoleGrid;

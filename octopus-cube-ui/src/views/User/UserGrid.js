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
import RegisterUserPopup from "./RegisterUserPopup";

class UserGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      status: "",
      isRegisterUserModal: false,
      userList: [],
      userInfo: {
        email: "",
        roleIdList: []
      },
      isOpen: false,
      isUpdate: true
    }
  }

  gridRef = React.createRef();

  componentDidMount() {
    axios({
      method: 'POST',
      url: '/v1/user/list',
      data: {},
    }).then(
        (response) => {
          console.log(response);
          const userList = response.data.userList.map(user => {
            let roleName = "";
            let roleIdList = [];
            user.roleList.forEach(role => {
              roleName += role.roleName + ','
              roleIdList.push(role.roleId);
            })
            user['roleName'] = roleName;
            user['roleIdList'] = roleIdList;
            return user;
          })
          this.setState({userList});
        },
        (error) => {
          console.log(error)
        }
    );
  }

  onChangeValue = (e) => {
    let {userInfo} = this.state;
    let checkbox = 0;
    switch (e.target.name) {
      case 'role_1':
        checkbox = 1;
        break;
      case 'role_2':
        checkbox = 2;
        break;
      case 'role_3':
        checkbox = 3;
        break;
      case 'role_4':
        checkbox = 4;
        break;
      case 'role_5':
        checkbox = 5;
        break;
      default:
        checkbox = 0;
    }
    if (checkbox === 0) {
      userInfo[e.target.name] = e.target.value;
    } else {
      e.target.checked ? userInfo.roleIdList.push(checkbox) : userInfo.roleIdList.splice(userInfo.roleIdList.indexOf(checkbox), 1);
    }
    userInfo = JSON.parse(JSON.stringify(userInfo));
    this.setState({userInfo})
  }


  onClickCell = (e) => {
    let {userList} = this.state;
    const rowKey = e.rowKey;
    if (rowKey === undefined) {
      return;
    }
    let userInfo = userList[rowKey];
    switch (e.columnName) {
      case 'email':
        userInfo = JSON.parse(JSON.stringify(userInfo));
        this.setState({userInfo}, this.toggleRegisterUser);
        break;
      default:
        break;
    }
  }

  toggleRegisterUser = (isUpdate = true) => {
    this.setState({isUpdate});
    if (!isUpdate) {
      this.setState({isRegisterUserModal: !this.state.isRegisterUserModal, userInfo: {email: "", roleIdList: []}})
    } else {
      this.setState({isRegisterUserModal: !this.state.isRegisterUserModal})
    }
  }

  toggle = () => {
    this.setState({isOpen: !this.state.isOpen})
  }

  downloadExcel = () => {
    this.gridRef.current.getInstance().export('xlsx', {fileName: '????????? ?????????'});
  }

  onKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  columns = [
    {
      header: 'ID',
      name: 'email',
      width: 180,
      formatter: ({row}) => {
        return '<div style="color: blue; text-decoration: underline; cursor: pointer;">' + row.email + '</div>'
      },
      filter: 'text'
    },
    {
      header: '??????',
      name: 'deptName',
      width: 200,
      filter: 'select'
    },
    {
      header: '??????',
      name: 'userName',
      width: 200,
      filter: 'text'
    },
    {
      header: '??????',
      name: 'roleName',
      width: 280,
      align: 'center',
    },
    {
      header: '????????????',
      name: 'status',
      width: 120,
      align: 'center',
      formatter: ({row}) => {
        if (row.status === 1) {
          return '??????'
        } else {
          return '<div style="color: red;">??????</div>'
        }
      }
    },
  ];

  renderContent() {
    let {userList} = this.state;
    return (
        <>
          <Grid
              ref={this.gridRef}
              data={userList}
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

  render() {
    const {isOpen, isRegisterUserModal, userInfo, isUpdate} = this.state;
    return (
        <div className="animated fadeIn">
          <Row>
            <Col xs="12" lg="12">
              <Card style={{marginBottom: 15 + 'px'}}>
                <CardHeader>
                  <Form inline>
                    <FormGroup className="pr-3" onKeyPress={this.onKeyPress}>
                      <Label style={{fontWeight: 'bold', paddingRight: '10px'}}>??????</Label>
                      <Input type="text" id="exampleInputEmail2" placeholder="????????? ??????" style={{width: 180 + 'px'}}/>
                      <Label style={{fontWeight: 'bold', padding: '0 10px 0 10px'}}>??????</Label>
                      <Input type="text" id="exampleInputEmail2" placeholder="?????? ??????" style={{width: 180 + 'px'}}/>
                      <Label style={{fontWeight: 'bold', padding: '0 10px 0 10px'}}>??????</Label>
                      <Input type="select" id="exampleInputEmail2" placeholder="?????? ??????" style={{width: 180 + 'px'}}>
                        <option value={0}>?????? ??????</option>
                        <option value={1}>???????????? ?????????</option>
                        <option value={2}>???????????? ?????????</option>
                        <option value={3}>????????? ?????????</option>
                        <option value={4}>???????????? ?????????</option>
                        <option value={5}>???????????? ?????????</option>
                      </Input>
                      <Label style={{fontWeight: 'bold', padding: '0 10px 0 10px'}}>??????</Label>
                      <Input type="select" id="exampleInputEmail2" placeholder="?????? ??????" style={{width: 180 + 'px'}}>
                        <option value={0}>?????? ??????</option>
                        <option value={1}>??????</option>
                        <option value={2}>??????</option>
                      </Input>
                    </FormGroup>
                    <Button size="sm" color="primary" onClick={this.fetchData}>
                      <i className="fa fa-dot-circle-o"/>??????</Button>
                    <FormGroup style={{marginLeft: 'auto', marginRight: 0}}>
                      <ButtonDropdown isOpen={isOpen} toggle={this.toggle}>
                        <DropdownToggle caret color="primary">
                          <i className="fa fa-list"/>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={() => this.toggleRegisterUser(false)}>
                            <i className="fa fa-user"/>????????? ??????
                          </DropdownItem>
                          <DropdownItem onClick={this.downloadExcel}>
                            <i className="fa fa-table"/>????????? ??????
                          </DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </FormGroup>
                  </Form>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"/>?????????
                </CardHeader>
                {this.renderContent()}
                <RegisterUserPopup
                    //key={userInfo.email}
                    onChangeValue={this.onChangeValue}
                    isOpen={isRegisterUserModal}
                    toggle={this.toggleRegisterUser}
                    registerUser={this.registerUser}
                    userInfo={userInfo}
                    isUpdate={isUpdate}
                    {...this.props}/>
              </Card>
            </Col>
          </Row>
        </div>
    );
  }
}

export default UserGrid;

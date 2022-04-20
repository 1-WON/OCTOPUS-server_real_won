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
import moment from "moment";
import DatePicker from "react-datepicker";

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

class AuditGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fromDate: moment().subtract(7, 'days').toDate(),//moment(new Date()).format('YYYY-MM-DD'),
      toDate: moment().subtract(1, 'days').toDate(),
      search: "",
      status: "",
      logList: [],
    }
  }

  componentDidMount() {
    const logList = [
      {
        createdAt: '2021-11-27 15:04:05',
        ip: '192.168.10.10',
        deptName: '마케팅 팀',
        userName: '이옥토',
        menu: '사전준비',
        actionType: '저장(성공)',
        desc: '사전준비 임시 저장'
      },
      {
        createdAt: '2021-11-26 15:04:05',
        ip: '192.168.10.11',
        deptName: '사업 팀',
        userName: '이사업',
        menu: '가명처리',
        actionType: '수정(성공)',
        desc: '가명처리 실행'
      },
    ];
    this.setState({logList});
  }

  columns = [
    {
      header: '로그 일시',
      name: 'createdAt',
      width: 180,
      filter: 'text',
      align: 'center'
    },
    {
      header: 'IP',
      name: 'ip',
      width: 200,
      filter: 'select'
    },
    {
      header: '사용자',
      name: 'userName',
      width: 200,
      filter: 'text'
    },
    {
      header: '소속부서',
      name: 'deptName',
      width: 200,
      filter: 'select',
    },
    {
      header: '접근메뉴',
      name: 'menu',
      width: 150,
      align: 'center',
    },
    {
      header: '작업유형',
      name: 'actionType',
      width: 150,
      align: 'center',
    },
    {
      header: '세부 정보',
      name: 'desc',
      width: 250,
    },
  ];

  toggle = () => {
    this.setState({isOpen: !this.state.isOpen})
  }

  renderContent() {
    let {logList} = this.state;
    return (
        <>
          <Grid
              data={logList}
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

  onSearchBtnClick = (days) => {
    let toDate = moment().subtract(1, 'days').toDate();
    let fromDate = moment(toDate).subtract(Number(days) - 1, 'days').toDate();
    this.setState({fromDate: fromDate, toDate: toDate});
  }

  onFromDateChange = (date) => {
    this.setState({fromDate: date});
  };

  onToDateChange = (date) => {
    this.setState({toDate: date});
  };

  render() {
    const {isOpen, fromDate, toDate} = this.state;
    return (
        <div className="animated fadeIn">
          <Row>
            <Col xs="12" lg="12">
              <Card style={{marginBottom: 15 + 'px'}}>
                <CardHeader>
                  <Form inline>
                    <FormGroup className="pr-1">
                      <Button size="sm" color="primary" onClick={() => this.onSearchBtnClick(30)}><i className="fa fa-dot-circle-o"/>한달</Button>
                    </FormGroup>
                    <FormGroup className="pr-1">
                      <Button size="sm" color="primary" onClick={() => this.onSearchBtnClick(90)}><i className="fa fa-dot-circle-o"/>3개월</Button>
                    </FormGroup>
                    <FormGroup className="pr-1">
                      <Button size="sm" color="primary" onClick={() => this.onSearchBtnClick(365)}><i className="fa fa-dot-circle-o"/>1년</Button>
                    </FormGroup>
                    <FormGroup className="pr-2">
                      <DatePicker className="form-control" selected={fromDate} onChange={this.onFromDateChange} onFocus={e => e.target.blur()} dateFormat="yyyy-MM-dd"/>
                      &nbsp;~&nbsp;
                      <DatePicker className="form-control" selected={toDate} onChange={this.onToDateChange} onFocus={e => e.target.blur()} dateFormat="yyyy-MM-dd"/>
                    </FormGroup>
                    <FormGroup className="pr-2">
                      <Input type="text" id="exampleInputEmail2" placeholder="작업유형 입력" style={{width: 180 + 'px'}}/>
                    </FormGroup>
                    <FormGroup className="pr-2">
                      <Input type="text" id="exampleInputEmail2" placeholder="이름 입력" style={{width: 180 + 'px'}}/>
                    </FormGroup>
                    <FormGroup className="pr-2">
                      <Input type="text" id="exampleInputEmail2" placeholder="IP 입력" style={{width: 180 + 'px'}}/>
                    </FormGroup>
                    <FormGroup className="pr-2">
                      <Input type="select" id="exampleInputEmail2" placeholder="역할 선택" style={{width: 180 + 'px'}}>
                        <option value={0}>역할 선택</option>
                        <option value={1}>가명처리 수행자</option>
                        <option value={2}>가명정보 결합자</option>
                        <option value={3}>적정성 검토자</option>
                        <option value={4}>사후관리 담당자</option>
                        <option value={5}>가명정보 사용자</option>
                      </Input>
                    </FormGroup>
                    <Button size="sm" color="primary" onClick={this.fetchData}>
                      <i className="fa fa-dot-circle-o"/>검색</Button>
                    <FormGroup style={{marginLeft: 'auto', marginRight: 0}}>
                      <ButtonDropdown isOpen={isOpen} toggle={this.toggle}>
                        <DropdownToggle caret color="primary">
                          <i className="fa fa-list"/>
                        </DropdownToggle>
                        <DropdownMenu>
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
                  <i className="fa fa-align-justify"/>감사로그
                </CardHeader>
                {this.renderContent()}
              </Card>
            </Col>
          </Row>
        </div>
    );
  }
}

export default AuditGrid;

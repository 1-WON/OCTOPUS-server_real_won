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
// import GetStdColumnList from "/Users/chong/Desktop/octopus-server-developer/octopus-api/controller/column_controller.go";

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

class SystemLogGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fromDate: moment().subtract(7, 'days').toDate(),
      toDate: moment().subtract(1, 'days').toDate(),
      search: "",
      status: "",

      columnList: [],
    }
  }

  componentDidMount() {
    
  this.fetchData();  
}


fetchData =() => {
  const {fromDate, toDate} = this.state;
    axios({
      method: 'POST',

      url: '/v1/std/column/list',
      data: {
        startDate: moment(fromDate).format('YYYY-MM-DD'),
        endDate: moment(toDate).format('YYYY-MM-DD')
      },
    }).then(
        (response) => {
          if (response.data.columnList == null) {
            this.setState({columnList: []});
          } else {
            this.setState({columnList: response.data.columnList});
          }
        },
        (error) => {
          console.log(error)
        }
    );


} 

  columns = [

    {
      header: '가명처리',
      name: 'pseudonymization',
      width: 130,
      align: 'center',     
    },
    {
      header: '특이 정보 처리',
      name: 'singularity',
      width: 300,
      align: 'center'
    },
    // {
    //   header: '표준컬럼ID',
    //   name: 'columnId',
    //   width: 100,
    //   filter: 'text',
    //   align: 'center'
    // },
    // {
    //   header: '컬럼이름',
    //   name: 'columnName',
    //   width: 100,
    //   filter: 'select'
    // },
    // {
    //   header: '개인정보 속성',
    //   name: 'attribute',
    //   width: 130,
    //   filter: 'select'
    // },
    // {
    //   header: '데이터유형',
    //   name: 'dataType',
    //   width: 130,
    //   filter: 'select'
    // },
    // {
    //   header: '데이터 값 유형',
    //   name: 'dataValueType',
    //   width: 130,
    //   filter: 'text',
    // },
    // {
    //   header: '규제',
    //   name: 'regulation',
    //   width: 150,
    // },
    // {
    //   header: '로그 일시',
    //   name: 'createdAt',
    //   width: 100,
    //   filter: 'text',
    //   align: 'center'
    // },
    // {
    //   header: '수정 일시',
    //   name: 'updated_at',
    //   width: 150,
    // },
   
    // {
    //   header: '표준 영문 이름 ',
    //   name: 'standardEngName',
    //   width: 150,
    // },
    // {
    //   header: '표준 한글 이름',
    //   name: 'standardKorName',
    //   width: 150,
    // },
    // {
    //   header: '도메인id',
    //   name: 'domainId',
    //   width: 150,
    // },
    // {
    //   header: '도메인이름',
    //   name: 'domainName',
    //   width: 150,
    // }
 ];

  toggle = () => {
    this.setState({isOpen: !this.state.isOpen})
  }

  renderContent() {
    let {columnList} = this.state;
    return (
        <>
          <Grid
              data={columnList}
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
                    <Button size="sm" color="primary" onClick={this.fetchData}>
                      <i className="fa fa-dot-circle-o"/>검색</Button>
                    <FormGroup style={{marginLeft: 'auto', marginRight: 0}}>
                      <ButtonDropdown isOpen={isOpen} toggle={this.toggle}>
                        <DropdownToggle caret color="primary">
                          <i className="fa fa-list"/>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={this.downloadExcel}>
                            <i className="fa fa-table"/>표준컬럼정의 추가 
                          </DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </FormGroup>
                  </Form>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"/>가명처리 관리                 
                </CardHeader>
                {this.renderContent()}
              </Card>
              
            </Col>
          </Row>
        </div>
    );
  }
}
export default SystemLogGrid;

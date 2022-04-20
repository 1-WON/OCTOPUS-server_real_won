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
import RegisterStdPopup from "./RegisterStdcolumnPopup";

class StdcoulmnGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      status: "",
      isRegisterStdModal: false,
      userList: [],
      coulmnList:[],
      coulmninfo:{
        ColumnId :"",
        stdcolumnList : []
      },
      isOpen: false,
      isUpdate: true,
      //토글링 준비
      isSel : false,
      isselect : true,
    }
  }

  gridRef = React.createRef();

  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    axios({
      method: 'POST',
      url: '/v1/std/column/list',
      data: {},
    }).then(
        (response) => {
          console.log(response);
          this.props.setLoader(false);
          if (response.data.columnList == null) {
            this.setState({columnList: []});
          } else {
            this.setState({columnList: response.data.columnList});
          }
        },
        (error) => {
          this.props.setLoader(false);
          console.log(error)
        }
        
    );
  }

  onChangeValue = (e) => {
    let {coulmninfo} = this.state;
    let checkbox = 0;

    if (checkbox === 0) {
      coulmninfo[e.target.name] = e.target.value;
    } else {
      e.target.checked ? coulmninfo.columnList.push(checkbox) : coulmninfo.columnList.splice(coulmninfo.columnList.indexOf(checkbox), 1);
    }
    coulmninfo = JSON.parse(JSON.stringify(coulmninfo));
    console.log(coulmninfo);
    this.setState({coulmninfo})
  }


  onClickCell = (e) => {
    let {columnList} = this.state;
    const rowKey = e.rowKey;
    if (rowKey === undefined) {
      return;
    }
    let coulmninfo = columnList[rowKey];
    switch (e.columnName) {
      case 'columnName':
        coulmninfo = JSON.parse(JSON.stringify(coulmninfo));
        this.setState({coulmninfo}, this.toggleRegisterStdcolumn);
        break;
      default:
        break;
    }
  }



  toggleRegisterStdcolumn = (isUpdate = true) => {
    this.setState({isUpdate});
    if (!isUpdate) {
      this.setState({isRegisterStdModal: !this.state.isRegisterStdModal, coulmninfo: { columnList: []}})

    } else {
      this.setState({isRegisterStdModal: !this.state.isRegisterStdModal})
    }
  }




  toggle = () => {
    this.setState({isOpen: !this.state.isOpen})
  }

  toggle2= () => {
    this.setState({isselect: !this.state.isSel})
  }
  


  downloadExcel = () => {
    this.gridRef.current.getInstance().export('xlsx', {fileName: '표준컬럼정의 리스트'});
  }

  onKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
    }
  };


  columns = [

    {
      header: '컬럼 이름',
      name: 'columnName',
      width: 150,
      filter: 'select',
      formatter: ({row}) => {
        return '<div style="color: blue; text-decoration: underline; cursor: pointer;">' + row.columnName + '</div>'
      },
      align: 'center'
       
    },
    {
      header: '표준 영문 이름 ',
      name: 'standardEngName',
      align: 'center',
      width: 150,
    },
    {
      header: '표준 한글 이름',
      name: 'standardKorName',
      width: 150,
      align: 'center'
    },

    {
      header: '개인정보 속성',
      name: 'attribute',
      width: 150,
      filter: 'select',
      align: 'center',
      formatter: ({row}) => {
        if (row.attribute === 1) {
          return '식별자'
        } if (row.attribute === 2) {
          return '준식별자'
        } if (row.attribute === 3) {
            return '일반'
        }
      }
    },
    {
      header: '데이터 유형',
      name: 'dataType',
      width: 150,
      filter: 'select',
      align: 'center',
      formatter: ({row}) => {
        if (row.dataType === 1) {
          return '문자'
        } if (row.dataType === 2) {
          return '숫자'
        } 
      }
    },
    {
      header: '데이터 값 유형',
      name: 'dataValueType',
      width: 150,
      filter: 'text',
      align: 'center',
      formatter: ({row}) => {
        if (row.dataValueType === 1) {
          return '수치형'
        } if (row.dataValueType === 2) {
          return '범주형'
        } if (row.dataValueType === 3) {
            return '일반'
        }
      }
    },
    
    // {
    //   header: '도메인id',
    //   name: 'domainId',
    //   width: 80,
    //   align: 'center'
    // },
    // {
    //   header: '도메인 이름',
    //   name: 'domainName',
    //   width: 100,
    //   align: 'center'
    // },
    {
      header: '가명처리',
      name: 'Pseudonymization',
      width: 150,
      align: 'center',
      formatter: ({row}) => {
          if (row.Pseudonymization === 1) {
          return '암호화'
        } if (row.Pseudonymization === 2) {
          return '범주화'
        } if (row.Pseudonymization === 3) {
          return '라운딩'
        } if (row.Pseudonymization === 4) {
          return '상하단코딩'
        } if (row.Pseudonymization === 5) {
          return '마스킹'
        } if (row.Pseudonymization === 6) {
          return '삭제-열(컬럼)'
        } if (row.Pseudonymization === 7) {
          return '삭제-행(레코드)'
        } if (row.Pseudonymization === 8) {
          return '삭제-셀(로컬)'
        } if (row.Pseudonymization === 9) {
          return '사용자정의'
        } if (row.Pseudonymization === 10) {
          return '처리않음'
        }
      }
    },
    // {
    //   header: '가명처리 템플릿',
    //   name: 'Pseudo_template',
    //   width: 230,
    //   align: 'center'
    // },
    {
      header: '특이정보처리',
      name: 'Singularity',
      width: 150,
      align: 'center',
      formatter: ({row}) => {
        if (row.dataValueType === 1) {
          return '빈도삭제'
        } if (row.dataValueType === 2) {
          return '상하단코딩'
        } if (row.dataValueType === 3) {
            return '처리않음'
        }
      }
    },    
    // {
    //   header: '상하단코딩 값',
    //   name: 'Singularity_template',
    //   width: 230,
    //   align: 'center'
    // }
  ];

  

  

  renderContent() {
    let {columnList} = this.state;
    return (
        <>
          <Grid
              ref={this.gridRef}              
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

  render() {
    const {isOpen,   isUpdate, coulmninfo, isRegisterStdModal } = this.state;
    return (
        <div className="animated fadeIn">
          <Row>
            <Col xs="12" lg="12">
              <Card style={{marginBottom: 15 + 'px'}}>
                <CardHeader>
                  <Form inline>
                    <FormGroup className="pr-3" onKeyPress={this.onKeyPress}>
                      <Label style={{fontWeight: 'bold', padding: '0 10px 0 10px'}}>컬럼이름</Label>
                      <Input type="text" id="exampleInputEmail2" placeholder="컬럼 이름 입력" style={{width: 180 + 'px'}}/>
                      <Label style={{fontWeight: 'bold', padding: '0 10px 0 10px'}}>도메인 ID</Label>
                      <Input type="text" id="exampleInputEmail2" placeholder="domain id 입력" style={{width: 180 + 'px'}}>
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
                          <DropdownItem onClick={() => this.toggleRegisterStdcolumn(false)}>
                            <i className="fa fa-user"/>표준컬럼 추가 
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
                  <i className="fa fa-align-justify"/>데이터컬럼 속성 관리
                </CardHeader>
                {this.renderContent()}
                <RegisterStdPopup
                    fetchData={this.fetchData}    
                    onChangeValue={this.onChangeValue}                
                    isOpen={isRegisterStdModal}                    
                    toggle={this.toggleRegisterStdcolumn}                    
                    coulmninfo={coulmninfo}
                    isUpdate={isUpdate}
                    {...this.props}/>
              </Card>
            </Col>
          </Row>
        </div>
    );
  }
}

export default StdcoulmnGrid;

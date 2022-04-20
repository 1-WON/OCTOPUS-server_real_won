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
import Grid from "@toast-ui/react-grid";

class CustomTextEditor {
  constructor(props) {
    console.log(props);
    const el = document.createElement('input');

    el.type = 'text';
    el.value = String(props.value);

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

class PreConsultColumn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      preConsultColumnList: []
    }
  }

  gridRef = React.createRef();

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.preConsultId !== this.props.preConsultId) {
      this.fetchData();
    }
  }

  fetchData = () => {
    const {preConsultId} = this.props;
    if (preConsultId === 0) {
      return;
    }
    this.props.setLoader(true);
    axios({
      method: 'POST',
      url: '/v1/pre_consult/column/list',
      data: {
        preConsultId: preConsultId
      },
    }).then(
        (response) => {
          this.props.setLoader(false);
          console.log(response);
          this.setState({preConsultColumnList: response.data.columnList});
        },
        (error) => {
          this.props.setLoader(false);
          console.log(error)
        }
    );
  }

  downloadExcel = () => {
    this.gridRef.current.getInstance().export('xlsx', {fileName: '사전 컨설팅'});
  }

  columns = [
    {
      header: '도메인',
      name: 'domain',
      width: 120,
      editor: {
        type: CustomTextEditor,
      },
      filter: 'text',
    },
    {
      header: '컬럼 이름',
      name: 'columnName',
      width: 180,
      filter: 'text',
      editor: {
        type: CustomTextEditor,
      },
    },
    {
      header: '표준 영문명',
      name: 'standardEngName',
      width: 150,
      filter: 'text',
      editor: {
        type: CustomTextEditor,
      },
    },
    {
      header: '표준 한글명',
      name: 'standardKorName',
      width: 150,
      filter: 'text',
      editor: {
        type: CustomTextEditor,
      },
    },
    {
      header: '개인정보 속성 유형',
      name: 'attribute',
      width: 120,
      filter: 'text',
      editor: {
        type: CustomTextEditor,
      },
    },
    {
      header: '자료 형태',
      name: 'dataType',
      width: 120,
      filter: 'text',
      editor: {
        type: CustomTextEditor,
      },
    },
    {
      header: '데이터 유형',
      name: 'dataValueType',
      width: 120,
      filter: 'text',
      editor: {
        type: CustomTextEditor,
      },
    },
    {
      header: '기타',
      name: 'etc',
      width: 120,
      filter: 'text',
      editor: {
        type: CustomTextEditor,
      },
    },
    {
      header: '가명처리 목적',
      name: 'pseudoPurpose',
      width: 200,
      filter: 'text',
      editor: {
        type: CustomTextEditor,
      },
    },
    {
      header: '가명처리 수준정의',
      name: 'pseudoLevel',
      width: 120,
      filter: 'text',
      editor: {
        type: CustomTextEditor,
      },
    },
    {
      header: '특이정보 처리',
      name: 'specialData',
      width: 120,
      filter: 'text',
      editor: {
        type: CustomTextEditor,
      },
    },
    {
      header: '제출 데이터 예시',
      name: 'sample',
      width: 120,
      filter: 'text',
      editor: {
        type: CustomTextEditor,
      },
    },
  ];

  renderContent() {
    let {preConsultColumnList} = this.state;
    return (
        <>
          <Grid
              ref={this.gridRef}
              data={preConsultColumnList}
              rowHeaders={['rowNum']}
              rowHeight={50}
              //bodyHeight={window.innerHeight - 350}
              columns={this.columns}
              columnOptions={{
                resizable: true,
              }}
          />
        </>
    );
  }

  renderModalFooter() {
    return (
        <>
          <Button color="primary" onClick={this.downloadExcel}>엑셀 다운로드</Button>{' '}
          <Button color="secondary" onClick={this.props.toggle}>확인</Button>
        </>
    )

  }

  render() {
    return (
        <Modal
            isOpen={this.props.isOpen}
            toggle={this.props.toggle}
            className={'modal-primary modal-xl'}>
          <ModalHeader toggle={this.toggle}>사전 컨설팅 데이터</ModalHeader>
          <ModalBody>
            <Form>
              <Row>
                <Col xs="12" md="12">
                  {this.renderContent()}
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

export default PreConsultColumn;

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
      coulmnList:[],
     
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
    const {coulmnnId, columnName ,attribute, dataType, dataValueType, standardEngName, standardKorName, domainId, domainName,Pseudonymization,Pseudo_template,Singularity,Singularity_template}  = this.props.coulmninfo;    
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
    if (!domainName) {
      alert("도메인 이름을 입력해 주세요");
      return;
    }

    if (!Pseudonymization) {
      alert("가명처리 기법을 선택해 주세요");
      return;
    }
    // if (!Pseudo_template==null) {
    //   alert("가명처리 기법에 맞게 템플릿을 작성해주세요");
    //   return;
    // }
    if (!Singularity_template) {
      alert("특이정보처리 기법에 맞게 탬플릿을 작성해주세요");
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
        domainName : domainName,
        Pseudonymization : Number(Pseudonymization),     
        Pseudo_template : Pseudo_template,
        Singularity : Number(Singularity),
        Singularity_template : Singularity_template
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

  temlist(){
    const {Ptemlist} = this.state;
    // return value(this.props.coulminfo.Pseudo_template) => {
    //   if(Pseudo_template==1){
    //     return <option key 
    //   }
    // }
    var Ptem1 = "{'\n\Pseudonymization' : 1,\n\ 'hash' : 'SHA256',\n\ 'Salt' : '자동생성',\n\ 'Salt_length' :25,\n\ 'Salt_Data' : 'insert',\n\ 'Salt_Position' : '문자열 앞' \n\  '}"
    var Ptem2 = "{'\n\Pseudonymization' : 2,\n\ 'hash' : 'SHA256',\n\ 'Salt' : '자동생성',\n\ 'Salt_length' :25,\n\ 'Salt_Data' : 'insert',\n\ 'Salt_Position' : '문자열 앞' \n\  '}"
  }

  render() {
    const colStyle = {paddingRight: 0}
    
    
    var Ptem1 = "{'\n\Pseudonymization' : 1,\n\ 'hash' : 'SHA256',\n\ 'Salt' : '자동생성',\n\ 'Salt_length' :25,\n\ 'Salt_Data' : 'insert',\n\ 'Salt_Position' : '문자열 앞' \n\  '}"
    var Ptem2 = "{'\n\Pseudonymization' : 2,\n\ 'hash' : 'SHA256',\n\ 'Salt' : '자동생성',\n\ 'Salt_length' :25,\n\ 'Salt_Data' : 'insert',\n\ 'Salt_Position' : '문자열 앞' \n\  '}"   
 


    return (
        <Modal
            // Ptemlist={this.props.temlist}
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
                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}> 도메인 이름 </Label>
                    </Col>
                    <Col xs="12" md="9">
                    <Input type="text" name="domainName" placeholder="도메인 이름을 입력해주세요." value={this.props.coulmninfo.domainName} onChange={this.props.onChangeValue}/>
                    </Col>
                  </FormGroup>


                 

                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}>가명처리 </Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="select" name="Pseudonymization" value={this.props.coulmninfo.Pseudonymization} onChange={this.props.onChangeValue}>                        
                        <option value={0}>가명처리 기법을 선택해주세요</option>   
                        <option value={1}>암호화</option>
                        <option value={2}>범주화</option>
                        <option value={3}>라운딩</option>
                        <option value={4}>상하단코딩</option>
                        <option value={5}>마스킹</option>
                        <option value={6}>삭제-열(컬럼)</option>
                        <option value={7}>삭제-행(레코드)</option>
                        <option value={8}>삭제-셀(로컬)</option>
                        <option value={9}>사용자정의</option>
                        <option value={10}>처리않음</option>
                      </Input>                     
                    </Col>
                    <Col xs="12" md="40">
                    <Input type="textarea" name="Pseudo_template" placeholder="가명처리 별 json 형식입니다 가명처리를 선택해주세요 " value={this.props.coulmninfo.Pseudo_template}  onChange={this.props.onChangeValue} 
                    defaultValue={Ptem1}>
                       
                       {/* defaultValue={"{'\n\Pseudonymization' : 1,\n\ 'hash' : 'SHA256',\n\ 'Salt' : '자동생성',\n\ 'Salt_length' :25,\n\ 'Salt_Data' : 'insert',\n\ 'Salt_Position' : '문자열 앞' \n\  '}"}>    */}
                        {/* if value==1(
                          Pseudo_template.defaultValue={"{'\n\Pseudonymization' : 1,\n\ 'hash' : 'SHA256',\n\ 'Salt' : '자동생성',\n\ 'Salt_length' :25,\n\ 'Salt_Data' : 'insert',\n\ 'Salt_Position' : '문자열 앞' \n\  '}"}
                        ) */}
                
                      
                      
                       </Input>
                    </Col>
                  </FormGroup>



                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}> 특이정보처리 </Label>
                    </Col>
                    <Col xs="12" md="9">
                      
                      <Input type="select" name="singularity" value={this.props.coulmninfo.dataValueType} onChange={this.props.onChangeValue}>                                            
                        <option value={1}>수치형</option>
                        <option value={2}>범주형</option>             
                        <option value={3}>처리않음</option>             
                      </Input>                     
                    </Col>
                    {/* <Col xs="12" md="30">
                 <Input type="textarea" name="singularity" placeholder="특이정보처리 별 json 형식입니다 특이정보 처리기법을 선택해주세요 "  onChange={this.props.onChangeValue}/>                                        
                    </Col>                                       */}
                  </FormGroup>











                  <FormGroup row>
                    <Col md="3" style={colStyle}>
                      <Label style={{margin: 0, verticalAlign: 'middle'}}> 상하단코딩값</Label>
                    </Col>

                    <Col xs="12" md="50">
                    <Input type="textarea" name="Singularity_template" placeholder="상하단 코딩값 json값 입력해주세요  " value={this.props.coulmninfo.Singularity_template}  onChange={this.props.onChangeValue}/>
                    </Col>
             {/* <Col xs="10" md="5" >
                    <Input type="select" name="domainName" value={this.props.coulmninfo} onChange={this.props.onChangeValue}> 
                        <option value={0}>범위기준 선택</option>   
                        <option value={1}>시그마 규칙</option>
                        <option value={2}>사용자 정의</option>  
                      </Input>  
                      <Input type="select" name="domainName" value={this.props.coulmninfo} onChange={this.props.onChangeValue}>
                        <option value={0}>대체값 지정</option>   
                        <option value={1}>최빈값</option>
                        <option value={2}>중앙값</option>  
                        <option value={3}>평균값</option>  
                        <option value={4}>NULL</option>  
                    </Input>   
                    <Input type="text" name="" placeholder="상단 값 입력." value={this.props.coulmninfo.coulmnnId} onChange={this.props.onChangeValue}/>
                    <Input type="text" name="" placeholder="하단 값 입력." value={this.props.coulmninfo.coulmnnId} onChange={this.props.onChangeValue}/>
                    <Input type="text" name="" placeholder="미리보기 샘플 수 입력" value={this.props.coulmninfo.coulmnnId} onChange={this.props.onChangeValue}/>  */}
                                        
                  </FormGroup>




                  {/* <FormGroup row>
                   <Col xs="12" md="9">
                      <Input type="text" name="singularity" placeholder="빈도값을 입력해주세요" value={this.props.coulmninfo.singularity} onChange={this.props.onChangeValue}/>         
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


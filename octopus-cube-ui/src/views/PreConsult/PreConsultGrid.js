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
import PreConsultColumn from "./PreConsultColumn";

class PreConsultGrid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search: "",
            status: "",
            isPreConsultColumnModal: false,
            preConsultList: [],
            preConsultId: 0
        }
    }

    gridRef = React.createRef();

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        this.props.setLoader(true);
        axios({
            method: 'POST',
            url: '/v1/pre_consult/list',
            data: {},
        }).then(
            (response) => {
                this.props.setLoader(false);
                console.log(response);
                this.setState({preConsultList: response.data.preConsultList});
            },
            (error) => {
                this.props.setLoader(false);
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
        let {preConsultList} = this.state;
        const rowKey = e.rowKey;
        if (rowKey === undefined) {
            return;
        }
        let preConsultInfo = preConsultList[rowKey];
        console.log(preConsultInfo);
        switch (e.columnName) {
            case 'data':
                this.setState({preConsultId: preConsultInfo.id}, this.togglePreConsultColumn);
                break;
            default:
                break;
        }
    }

    togglePreConsultColumn = (isUpdate = true) => {
        this.setState({isPreConsultColumnModal: !this.state.isPreConsultColumnModal})
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }


    onKeyPress = event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
        }
    };

    columns = [
        {
            header: '데이터 보기',
            name: 'data',
            width: 120,
            formatter: ({row}) => {
                return '<div><i class="fa fa-search fa-lg" style="margin-right: 8px; cursor: pointer;"></i></div>';
            },
            align: 'center'
        },
        {
            header: '요청자 이름',
            name: 'requesterName',
            width: 180,
            filter: 'text'
        },
        {
            header: '요청자 이메일',
            name: 'requesterEmail',
            width: 200,
            filter: 'text'
        },
        {
            header: '요청자 부서',
            name: 'requesterDept',
            width: 200,
            filter: 'text'
        },
        {
            header: '요청 일시',
            name: 'createdAt',
            width: 280,
            align: 'center',
        },
    ];

    renderContent() {
        let {preConsultList} = this.state;
        return (
            <>
                <Grid
                    ref={this.gridRef}
                    data={preConsultList}
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
        const {isPreConsultColumnModal,preConsultId} = this.state;
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12">
                        <Card style={{marginBottom: 15 + 'px'}}>
                            <CardHeader>
                                <Form inline>
                                    <FormGroup className="pr-3" onKeyPress={this.onKeyPress}>
                                        <Label style={{fontWeight: 'bold', paddingRight: '10px'}}>요청자 이름</Label>
                                        <Input type="text" id="exampleInputEmail2" placeholder="이름 입력" style={{width: 180 + 'px'}}/>
                                        <Label style={{fontWeight: 'bold', padding: '0 10px 0 10px'}}>요청자 이메일</Label>
                                        <Input type="text" id="exampleInputEmail2" placeholder="이메일 입력" style={{width: 180 + 'px'}}/>
                                    </FormGroup>
                                    <Button size="sm" color="primary" onClick={this.fetchData}>
                                        <i className="fa fa-dot-circle-o"/>검색</Button>
                                </Form>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"/>사전 컨설팅 요청
                            </CardHeader>
                            {this.renderContent()}
                            <PreConsultColumn
                                preConsultId = {preConsultId}
                                isOpen={isPreConsultColumnModal}
                                toggle={this.togglePreConsultColumn}
                                {...this.props}/>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default PreConsultGrid;

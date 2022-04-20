import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem} from 'reactstrap';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import {AppAsideToggler, AppNavbarBrand, AppSidebarToggler} from '@coreui/react';
import logo from '../../assets/img/brand/logo.svg'
import logo_1 from '../../assets/img/brand/logo_1.png'
import logo_2 from '../../assets/img/brand/logo_2.jpg'
import itcha_logo from '../../assets/img/brand/itcha_logo.svg'
import sygnet from '../../assets/img/brand/sygnet.svg'
import sygnet_1 from '../../assets/img/brand/symbol.jpg'
//import ChangePasswordPopup from "../../views/User/ChangePasswordPopup";


const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      email: "",
      userName: ""
    }
  }

  componentDidMount() {
    this.setState({
      email: window.sessionStorage.getItem("email"),
      userName: window.sessionStorage.getItem("userName"),
    })
  }

  changePasswordPopup = () => {
    this.setState({modal: !this.state.modal})
  }

  render() {
    // eslint-disable-next-line
    const {children, ...attributes} = this.props;
    const {email, userName} = this.state;
    return (
        <React.Fragment>
          <AppSidebarToggler className="d-lg-none" display="md" mobile/>
          <AppNavbarBrand
              style={{backgroundColor: '#5aa4de', color: '#ffffff', fontSize: "30px", fontWeight: 'bold'}}
              children={'CUBE'}
              full={{src: "", width: '100%', height: '100%', alt: 'SSC-PICP'}}
              minimized={{src: "", width: 0, height: 0, alt: ''}}
          />
          <AppSidebarToggler className="d-md-down-none" display="lg"/>

          <Nav className="ml-auto" navbar style={{paddingRight: 30 + 'px'}}>
            <UncontrolledDropdown nav direction="down">
              <DropdownToggle nav>
                <img src={'../../assets/img/avatars/7.jpg'} className="img-avatar" alt=""/>
                {/*{email}({userName})<img src={'../../assets/img/avatars/7.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com"/>*/}
              </DropdownToggle>
              <DropdownMenu right>
                {/*<DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>*/}
                <DropdownItem header>{email}({userName})</DropdownItem>
                <DropdownItem onClick={this.changePasswordPopup}>비밀번호 변경</DropdownItem>
                <DropdownItem header></DropdownItem>
                <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"/>로그아웃</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          {/*<AppAsideToggler className="d-lg-none" mobile />*/}
          {/*<ChangePasswordPopup isOpen={this.state.modal} toggle={this.changePasswordPopup}/>*/}
        </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;

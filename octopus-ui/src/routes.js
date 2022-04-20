import React from 'react';

//사용자 관리
const User = React.lazy(() => import('./views/User'));
const AuditLog = React.lazy(() => import('./views/Log/Audit')); 
const SystemLog = React.lazy(() => import('./views/Log/System'));
const Role = React.lazy(() => import('./views/Policy/Role'));
const PolicyLogin = React.lazy(() => import('./views/Policy/Login'));
const pseudo = React.lazy(() => import('./views/Scolumn/pseudo')); 
const Scolumnlist = React.lazy(() => import('./views/Scolumn/Scolumnlist')); 

const routes = [
  {path: '/', exact: true, name: 'Home'},

  // 사용자 관리
  {path: '/user', name: '사용자 관리', component: User},
  // 로그관리
  {path: '/log', exact: true, name: '로그관리', component: AuditLog},
  {path: '/log/audit', exact: true, name: '감사로그', component: AuditLog},
  {path: '/log/system', exact: true, name: '시스템로그', component: SystemLog},
  // 정책관리
  {path: '/policy', exact: true, name: '정책관리', component: Role},
  {path: '/policy/role', exact: true, name: '사용자 역할관리', component: Role},
  {path: '/policy/account', exact: true, name: '로그인 정책관리', component: PolicyLogin},


  // //표준컬럼관리  
  {path: '/Scolumn/pseudo', exact: true, name: '표준컬럼관리', component: pseudo},
  {path: '/Scolumn/Scolumnlist', exact: true, name: '표준컬럼관리', component: Scolumnlist}
  
  
];

export default routes;



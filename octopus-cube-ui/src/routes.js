import React from 'react';

const PreConsult = React.lazy(() => import('./views/PreConsult'));

const routes = [
  {path: '/', exact: true, name: 'Home'},

  // 사전 컨설팅 관리
  {path: '/pre_consult', name: '사전 컨설팅 관리', component: PreConsult},

];

export default routes;

export default {
  items: [
    
    {
      key: 'M_USER',
      name: '사용자 관리',
      url: '/user',
      icon: 'icon-people'
    },

    {
      key: 'M_LOG',
      name: '로그관리',
      url: '/log',
      icon: 'icon-doc',
      children: [
        {
          key: 'M_LOG_AUDIT',
          name: '감사로그',
          url: '/log/audit',
          icon: 'icon-doc',
        },
        {
          key: 'M_LOG_SYSTEM',
          name: '시스템로그',
          url: '/log/system',
          icon: 'icon-minus',
        },
      ]
    },


  
    {
      key: 'M_POLICY',
      name: '정책관리',
      url: '/policy',
      icon: 'icon-magnet',
      children: [
        {
          key: 'M_POLICY_ROLE',
          name: '사용자 역할 관리',
          url: '/policy/role',
          icon: 'icon-user',
        },
        {
          key: 'M_POLICY_LOGIN',
          name: '로그인 정책 관리',
          url: '/policy/account',
          icon: 'icon-list',
        },
      

        // {
        //   name: '로그인 정책 관리',
        //   url: '/policy/login',
        //   icon: 'icon-list',
        // },
      ]

      
    },
  
    // {
    //   key: 'MYPAGE',
    //   name: '마이페이지',
    //   url: '/mypage',
    //   icon: 'icon-settings',
    // },


    {
      key: 'M_S_COULMN_DEF',
      name: '데이터 관리',
      url: '/Scolumn/',
      icon: 'icon-list',
      children : [
        //  {
        //    key: 'M_S_COULMN_DEF_M',
        //    name: '가명처리 관리 ',
        //    url: '/Scolumn/pseudo',
        //    icon: 'icon-list',
  
        // },
        {
          key: 'M_S_COULMN_DEF_2',
          name: '표준컬럼 속성관리',
          url: '/Scolumn/Scolumnlist',
          icon: 'icon-list',
 
       },
      //   {
      //     key: 'M_S_COULMN_DEF_I',    ScoulmnSgridGrid2
      //     name: '표준 컬럼 정의 추가',
      //     url: '/Scoulmn/gridI',
      //     icon: 'icon-list',
 
      //  },
      //   {
      //     key: 'M_S_COULMN_DEF_UP',
      //     name: '표준 컬럼 정의 수정',
      //     url: '/Scoulmn/gridup',
      //     icon: 'icon-list',
 
      //  }
  
      ]
    },
  ]
};

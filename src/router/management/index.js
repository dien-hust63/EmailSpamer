const routerManagement = [
      {
        path: '/',
        redirect:"/management/login",
      },
      {
        path: '/management/sender',
        name: 'm-sender',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "sender" */ '../../views/management/sender/SenderList.vue')
      },

      {
        path: '/management/receiver',
        name: 'm-receiver',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "receiver" */ '../../views/management/receiver/ReceiverList.vue')
      },
      {
        path: '/management/campaign',
        name: 'm-campaign',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "campaign" */ '../../views/management/campaign/CampaignList.vue')
      },
      {
        path: '/management/campaign/:id',
        name: "m-campaign-detail",
        component: () =>
            import(/*webpackChunkName "campaigndetail" */ '../../views/management/campaign/CampaignDetail.vue')
      },
      {
        path: '/management/productcategory',
        name: 'm-productcategory',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "productcategory" */ '../../views/management/productcategory/ProductCategoryList.vue')
      },
      {
        path: '/management/product',
        name: 'm-product',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "product" */ '../../views/management/product/ProductList.vue')
      },
      {
        path: '/management/product/:id',
        name: "m-product-detail",
        component: () =>
            import(/*webpackChunkName "product" */ '../../views/management/product/ProductDetail.vue')
      },
      
      {
        path: '/management/report',
        name: 'm-report',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "promotion" */ '../../views/management/report/ReportList.vue')
      },
      {
        path: '/management/login',
        name: 'm-login',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../../views/management/login/Login.vue')
      },
      {
        path: '/management/setting',
        component: () =>
                        import(/*webpackChunkName "branch" */ '../../views/management/setting/Setting.vue'),
        children: [
                { path: '', redirect: 'branch' },
                {
                    path: 'branch',
                    name: "m-branch",
                    component: () =>
                        import(/*webpackChunkName "branch" */ '../../views/management/branch/BranchList.vue')
                },
                {
                    path: 'employee',
                    name: "m-employee",
                    component: () =>
                        import(/*webpackChunkName "employee" */ '../../views/management/employee/EmployeeList.vue')
                },
                {
                  path: 'employee/:id',
                  name: "m-employee-detail",
                  component: () =>
                      import(/*webpackChunkName "employee" */ '../../views/management/employee/EmployeeDetail.vue')
                },
                {
                    path: 'role',
                    name: "m-role",
                    component: () =>
                        import(/*webpackChunkName "role" */ '../../views/management/role/RoleList.vue')
                },
                {
                  path: 'role/:id',
                  name: "m-role-detail",
                  component: () =>
                      import(/*webpackChunkName "roledetail" */ '../../views/management/role/RoleDetail.vue')
                },
            ]
      },
]
export default routerManagement;
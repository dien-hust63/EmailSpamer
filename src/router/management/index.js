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
        path: '/management/login',
        name: 'm-login',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../../views/management/login/Login.vue')
      },
      {
        path: '/management/setting',
        name: 'm-setting',
        component: () =>
                        import(/*webpackChunkName "branch" */ '../../views/management/setting/Setting.vue'),
      },
]
export default routerManagement;
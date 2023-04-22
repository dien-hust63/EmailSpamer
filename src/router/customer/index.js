const routerCustomer = [
    {
        path: '/',
        name: 'c-home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "homecustomer" */ '../../views/customer/home/Home.vue'),
        children: [
          {
              path: '',
              name: "c-main-home",
              component: () =>
                  import(/*webpackChunkName "mainhome" */ '../../views/customer/home/CMainHome.vue')
          },
          {
            path: 'product/:id',
            name: "c-product-detail",
            component: () =>
                import(/*webpackChunkName "productdetail" */ '../../views/customer/product/CProductDetail.vue')
          },
          {
            path: 'cart',
            name: "c-cart",
            component: () =>
                import(/*webpackChunkName "cart" */ '../../views/customer/cart/CCart.vue')
          },
          {
            path: '/productcategory/:id',
            name: 'c-productcategory',
            component: () => import(/* webpackChunkName: "cproductcategory" */ '../../views/customer/productcategory/CProductCategory.vue'),
          },
          {
            path: '/product/search',
            name: 'c-productsearch',
            component: () => import(/* webpackChunkName: "cproductsearch" */ '../../views/customer/product/CProductSearch.vue'),
          },
        ]
      },
      {
        path: '/checkout',
        name: 'c-checkout',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "checkout" */ '../../views/customer/checkout/Checkout.vue'),
      },
      {
        path: '/checkout/result',
        name: 'c-checkout-result',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "checkoutresult" */ '../../views/customer/checkout/CheckoutResult.vue'),
      },
      
]
export default routerCustomer;
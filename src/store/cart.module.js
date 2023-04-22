
export const cart = {
  namespaced: true,
  state: {
    cartList:[

    ],
    totalCartItem:0
  },
  actions: {
   
  },
  mutations: {
    addProductToCart(state, product) {
      if(product){
        let index = state.cartList.findIndex(x => x.idproduct == product.idproduct && x.color == product.color && x.size == product.size);
        if(index == -1){
          state.cartList.push(product)
          state.totalCartItem ++;
        }
        else{
          if(product.quantity && product.quantity != ""){
            state.cartList[index]["quantity"] = parseInt(state.cartList[index]["quantity"]) + parseInt(product.quantity);
          }
        }

      }
    },
    removeProductToCart(state, product){
      if(product){
        let index = state.cartList.findIndex(x => x.idproduct == product.idproduct && x.color == product.color && x.size == product.size);
        if(index != -1){
          state.cartList.splice(index, 1);
          if(state.totalCartItem > 0){
            state.totalCartItem --;
          }
        }

      }
    }
  }
};
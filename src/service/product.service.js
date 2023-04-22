import BaseService from "./base-service/base.service";
import axios from 'axios'
class ProductService extends BaseService{
  constructor() {
    super();
    this.controller = "Product"
  }

  /**
   * thêm mới
   * @param {*} param 
   * @returns 
   */
  insertProduct(param) {    
    return axios
      .post(`${this.apiURL}/${this.controller}/insertProduct`, param,{headers: {
        'Content-Type': 'multipart/form-data'
      }});
  }

  insertProductDetail(param){
    return axios
      .post(`${this.apiURL}/${this.controller}/insertProductDetail`, param,{headers: {
        'Content-Type': 'multipart/form-data'
      }});
  }

  updateProductDetail(param){
    return axios
      .post(`${this.apiURL}/${this.controller}/updateProductDetail`, param,{headers: {
        'Content-Type': 'multipart/form-data'
      }});
  }

  getProductDetail(id){
    return axios
      .get(`${this.apiURL}/${this.controller}/getProductDetail/${id}`);
  }

  getProductDetailByBranch(param){
    return axios
      .post(`${this.apiURL}/${this.controller}/getProductDetailByBranch`,param);
  }

  getListProductByCategory(param){
    return axios
      .post(`${this.apiURL}/${this.controller}/getListProductByCategory`, param);
  }
}



export default new ProductService();
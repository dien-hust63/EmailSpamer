import BaseService from "./base-service/base.service";
import axios from 'axios'
class BranchService extends BaseService{
  constructor() {
    super();
    this.controller = "Branch"
  }

  /**
   * thêm mới
   * @param {*} param 
   * @returns 
   */
  getBrancByUser(param) {    
    return axios
      .post(`${this.apiURL}/${this.controller}/getBrancByUser`, param);
  }
}



export default new BranchService();
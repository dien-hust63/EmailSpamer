import BaseService from "./base-service/base.service";
import axios from 'axios';
class ReceiverService extends BaseService{
  constructor() {
    super();
    this.controller = "Receiver"
  }

  /**
   * nhập khẩu
   * @param {*} param 
   * @returns 
   */
  importReceiver(param) {    
    return axios
      .post(`${this.apiURL}/${this.controller}/import`, param,{headers: {
        'Content-Type': 'multipart/form-data'
      }});
  }
}

export default new ReceiverService();
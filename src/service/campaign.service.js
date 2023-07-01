import axios from 'axios';
import BaseService from "./base-service/base.service";

class CampaignService extends BaseService{
  constructor() {
    super();
    this.controller = "Campaign"
  }

  sendEmail(param) {
    return axios
      .post(`${this.apiURL}/${this.controller}/sendEmail`,param);
  }

  testSendEmail(param){
    return axios
      .post(`${this.apiURL}/${this.controller}/testSendEmail`,param);
  }

  resetCampaign(param){
    return axios
      .post(`${this.apiURL}/${this.controller}/resetCampaign`,param);
  }

  addNewCampaign(param) {
    return axios
      .post(`${this.apiURL}/${this.controller}/addNewCampaign`,param);
  }

  updateCampaign(param){
    return axios
      .post(`${this.apiURL}/${this.controller}/updateCampaign`,param);
  }

  /**
   * Lấy dữ liệu theo id
   * @param {*} param 
   * @returns 
   */
  getDataByIDCustom(id) {
    return axios
      .get(`${this.apiURL}/${this.controller}/detail/${id}`);
  }

  getEmailSetting(){
    return axios
      .get(`${this.apiURL}/${this.controller}/getEmailSetting`);
  }

  
  updateEmailSetting(data){
    return axios
      .post(`${this.apiURL}/${this.controller}/updateEmailSetting`,data);
  }
}



export default new CampaignService();
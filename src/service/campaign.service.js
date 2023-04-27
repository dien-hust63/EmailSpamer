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

  addNewCampaign(param) {
    return axios
      .post(`${this.apiURL}/${this.controller}/addNewCampaign`,param);
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
}

export default new CampaignService();
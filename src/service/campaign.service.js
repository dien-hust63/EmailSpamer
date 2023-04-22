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
}

export default new CampaignService();
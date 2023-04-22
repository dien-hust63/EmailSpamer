import axios from 'axios';
import config from "../config/config.dev.json";
const API_URL = `${config.BASE_URL_API}`;
class PaymentService {
  constructor() {
    this.controller = "Payment",
    this.apiURL = API_URL
  }

  /**
   * lấy link thanh toán vnpay
   * @returns 
   */
  getVNPayLink(param){
    return axios
      .post(`${API_URL}/${this.controller}/redirect-vnpay`, param);
  }

}

export default new PaymentService();
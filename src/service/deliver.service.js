import axios from 'axios';
import config from "../config/config.dev.json";
const API_URL = `${config.GHN_URL_API}`;
class LocationService {
  constructor() {
    this.controller = null,
    this.apiURL = API_URL
  }

  /**
   * Lấy danh sách thông tin tỉnh thành
   * @returns 
   */
  getDeliverPrice(param) {
    return axios
      .post(`${API_URL}/shiip/public-api/v2/shipping-order/fee`,param, {
        headers: {
            Token: 'f5b29a26-8e3e-11ed-80b2-72ac9ccd70b2'
        }
       });
  }

  createShippingOrder(param) {
    return axios
      .post(`${API_URL}/shiip/public-api/v2/shipping-order/create`,param, {
        headers: {
            Token: 'f5b29a26-8e3e-11ed-80b2-72ac9ccd70b2',
            ShopId: '121443 - 0337877093'
        }
       });
  }
}

export default new LocationService();
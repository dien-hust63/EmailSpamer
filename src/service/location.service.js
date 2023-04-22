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
  getListProvince() {
    return axios
      .get(`${API_URL}/shiip/public-api/master-data/province`,{
        headers: {
            Token: 'f5b29a26-8e3e-11ed-80b2-72ac9ccd70b2'
        }
       });
  }

  getDistrictByProvince(provinceid){
    return axios
    .post(`${API_URL}/shiip/public-api/master-data/district`,{"province_id":provinceid},{
      headers: {
          Token: 'f5b29a26-8e3e-11ed-80b2-72ac9ccd70b2'
      }
     });
  }
  getWardByDistrict(districtid){
    return axios
    .post(`${API_URL}/shiip/public-api/master-data/ward`,{"district_id": districtid},{
      headers: {
          Token: 'f5b29a26-8e3e-11ed-80b2-72ac9ccd70b2'
      }
     });
  }

}

export default new LocationService();
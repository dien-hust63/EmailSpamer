import axios from 'axios';
import config from "../config/config.dev.json";
const API_URL = `${config.BASE_URL_API}/authentication/`;

class AuthService {
  async login(user) {
    const response =  await axios
      .post(API_URL + 'login', {
        email: user.email,
        password: user.password
      });
    return response.data;
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(user) {
    return axios.post(API_URL + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password
    });
  }

  getPermission(user) {
    return axios.post(API_URL + 'getPermission', {
      email: user.email,
    });
  }
}

export default new AuthService();
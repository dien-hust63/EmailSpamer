import BaseService from "./base-service/base.service";
import axios from "axios";

class RoleService extends BaseService{
  constructor() {
    super();
    this.controller = "Role"
  }

  /**
     * thêm quyền
     * @returns 
     */
  insertRoleCustom(data) {
    return axios.post(this.apiURL + `/${this.controller}` +'/insertRole', data);
  }

   /**
   * update role
   * @returns 
   */
  updateRoleCustom(data) {
    return axios.post(this.apiURL + `/${this.controller}` +'/updateRole', data);
  }

   /**
   * update role
   * @returns 
   */
   getRoleDetail(roleID) {
    return axios.get(this.apiURL + `/${this.controller}` +`/getDetail/${roleID}`);
  }
}

export default new RoleService();
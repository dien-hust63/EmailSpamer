import axios from 'axios';
import authHeader from './auth-header';
import BaseService from "./base-service/base.service";

class ModuleService extends BaseService {
    constructor() {
        super();
        this.controller = "Module"
    }
    /**
     * Lấy danh sách module và quyền của người dùng đối với các module đó
     * @returns 
     */
    getModulePermission() {
        return axios.post(this.apiURL + `/${this.controller}` +'/getModulePermission', { headers: authHeader() });
    }

    /**
     * Lấy danh sách module và quyền của người dùng đối với các module đó
     * @returns 
     */
    getModulePermissionDefault() {
        return axios.post(this.apiURL + `/${this.controller}` +'/getModulePermissionDefault', { headers: authHeader() });
    }
}

export default new ModuleService();
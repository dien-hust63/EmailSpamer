import BaseService from "./base-service/base.service";
class SenderService extends BaseService{
  constructor() {
    super();
    this.controller = "Sender"
  }
}



export default new SenderService();
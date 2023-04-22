import BaseService from "./base-service/base.service";
class ReceiverService extends BaseService{
  constructor() {
    super();
    this.controller = "Receiver"
  }
}

export default new ReceiverService();
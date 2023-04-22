import BaseService from "./base-service/base.service";

class ProductCategoryService extends BaseService{
  constructor() {
    super();
    this.controller = "ProductCategory"
  }
}

export default new ProductCategoryService();
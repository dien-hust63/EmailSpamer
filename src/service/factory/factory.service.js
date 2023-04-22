import RoleService from '../role.service';
import ProductCategoryService from '../productcategory.service';
import ProductService from '../product.service';
import BranchService from '../branch.service';
import EmployeeService from '../employee.service';
import LocationService from '../location.service';
import DeliverService from '../deliver.service';
import ModuleService from '../module.service';
import AzureService from '../azure.service';
import PaymentService from "../payment.service"
import AuthService from "../auth.service"
import OrderService from '../order.service';
import SenderService from '../sender.service';
import ReceiverService from '../receiver.service';
import CampaignService from '../campaign.service';
const serviceList = {
    branchService: BranchService,
    roleService: RoleService,
    employeeService: EmployeeService,
    productcategoryService: ProductCategoryService,
    productService: ProductService,
    locationService:LocationService,
    deliverService:DeliverService,
    moduleService:ModuleService,
    azureService:AzureService,
    paymentService:PaymentService,
    authService:AuthService,
    orderService:OrderService,
    senderService:SenderService,
    receiverService:ReceiverService,
    campaignService:CampaignService,
}
export const FactoryService = {
    get: name => serviceList[name]
}
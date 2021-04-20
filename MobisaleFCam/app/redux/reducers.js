import { combineReducers } from "redux";

import { reducer as splashReducer } from "../modules/splash";
import { reducer as authReducer } from "../modules/auth";
import { reducer as homeReducer } from "../modules/home";
import { reducer as customerInfoReducer } from "../modules/customer-info";
import { reducer as listCustomerInfoReducer } from "../modules/list-customer-info";
import { reducer as saleNewReducer } from "../modules/sale-new";
import { reducer as potentialCustomer } from "../modules/potential-customer";
import { reducer as extraServiceInfoReducer } from "../modules/extra-service-infomation";

const rootReducer = combineReducers({
  splashReducer,
  authReducer,
  homeReducer,
  customerInfoReducer,
  listCustomerInfoReducer,
  saleNewReducer,
  potentialCustomer,
  extraServiceInfoReducer
});

export default rootReducer;

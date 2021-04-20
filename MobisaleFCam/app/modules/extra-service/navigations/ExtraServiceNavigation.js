// import { createStackNavigator } from "react-navigation";

// Screen
import ExtraServiceLists from "../scenes/ExtraServiceLists";
import ContractListExtraService from "../scenes/ContractListExtraService";
import ExtraServiceCTDetail from "../scenes/ExtraServiceCTDetail";
import ExtraServiceReceipt from "../scenes/ExtraServiceReceipt";
import ExtraServiceUploadImage from '../scenes/ExtraServiceUploadImage';
import ExtraServiceViewImage from '../scenes/ExtraServiceViewImage';
import ExtraServicePaymentQrCode from '../scenes/ExtraServicePaymentQrCode';

export default {
	ExtraServiceLists: {
		screen: ExtraServiceLists
	},
	ContractListExtraService: {
		screen: ContractListExtraService
	},
	ExtraServiceCTDetail: {
		screen: ExtraServiceCTDetail
	},
	ExtraServiceReceipt: {
		screen: ExtraServiceReceipt
	},
	ExtraServiceUploadImage: {
		screen: ExtraServiceUploadImage
	},
	ExtraServiceViewImage: {
		screen: ExtraServiceViewImage
	},
	ExtraServicePaymentQrCode: {
		screen: ExtraServicePaymentQrCode
	}
};

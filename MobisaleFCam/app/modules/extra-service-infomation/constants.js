import { strings } from "locales/i18n";

export const NAME = "customerInfo";
export const KEYBOARD_NUMBER = "numeric"; // "number-pad"

export const isReturnOPT = [
	{ label: strings("extra_service.extra_service_info.type_of_service.infomation.equi_return"), value: true },
	{ label: strings("extra_service.extra_service_info.type_of_service.infomation.equi_notReturn"), value: false }
];

export const discountDefault = {
	label: "0%",
	value: 0
};

export const deviceReturnDefault = {
	isReturn: false,
	MAC: ""
};

export const internetUpgradeDefault = {
	EquipmentReturn: false,
	OldMonthMoney: 0
};

export const staticIPDefault = {
	ListIP: null,
	ListMonth: { Value: 1, Name: '1M' },
	ListStaticIP: [],
	Total: null,
}

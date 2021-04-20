// LIB
import React from "react";
import { View, Text } from "react-native";
import {
	createStackNavigator,
	createMaterialTopTabNavigator,
	HeaderBackButton
} from "react-navigation";
import { strings } from "locales/i18n";
import { connect } from "react-redux";

// LIB CUSTOM
import NavigationService from "app-libs/helpers/NavigationService";
import HandleBackExtraService from "../components/HandleBackExtraService";

// COMPONENT
import TabbarRegExtraService from "./TabbarCusInfExtraService";
import {
	CustomerInfoExtra,
	ServiceTypeExtra,
	TotalAmountExtra
} from "../scenes";

// CONST
const strTitle = strings(
	"extra_service.extra_service_info.titleNavigation.new"
);

const CustomTabStack = createMaterialTopTabNavigator(
	{
		ciInfoExtra: { screen: CustomerInfoExtra },
		ciServiceTypeExtra: { screen: ServiceTypeExtra },
		ciAmountExtra: { screen: TotalAmountExtra }
	},
	{
		initialRouteName: "ciInfoExtra",
		headerMode: "none",
		mode: "card",
		cardStyle: {
			shadowColor: "transparent"
		},
		navigationOptions: {
			headerStyle: {
				backgroundColor: "#0B76FF",
				borderBottomWidth: 0,
				shadowRadius: 0,
				shadowOffset: {
					height: 0
				},
				shadowColor: "transparent",
				elevation: 0
			},
			headerTintColor: "#FFFFFF",
			headerTitleStyle: {
				fontSize: 20,
				fontWeight: "bold",
				textAlign: "center",
				flexGrow: 1
			}
		},
		tabBarComponent: props => <TabbarRegExtraService {...props} />,
		tabBarPosition: "top",
		animationEnabled: true,
		swipeEnabled: false,
		lazy: true
	}
);

const CustomerInfoExtraNavigation = createStackNavigator(
	{
		ciMainExtra: {
			screen: CustomTabStack,
			navigationOptions: ({ navigation }) => {
				return {
					title: navigation.getParam("titleNav", strTitle),
					headerLeft: <HandleBackExtraService navigation={navigation} />,
				};
			}
		}
	},
	{
		initialRouteName: "ciMainExtra",
		defaultNavigationOptions: ({ navigation }) => ({
			// headerLeft: <HandleBackExtraService navigation={navigation} />,
			//headerBackTitle: null,
			headerStyle: {
				backgroundColor: "#0B76FF",
				borderBottomWidth: 0
			},
			headerTintColor: "#FFFFFF",
			headerTitleStyle: {
				fontSize: 20,
				fontWeight: "bold",
				textAlign: "center",
				alignSelf: "center",
				flexGrow: 1
			},
			headerRight: <View />
		})
	}
);

export default CustomerInfoExtraNavigation;

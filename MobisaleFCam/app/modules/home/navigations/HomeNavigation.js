import React from 'react';
import { View, YellowBox} from 'react-native';
import {
    createBottomTabNavigator, createDrawerNavigator, createStackNavigator
} from 'react-navigation'; // Version can be specified in package.json

// COMPONENT
import ButtonBack from '../components/ButtonBack';
import MainMenu from "../components/MainMenu";
import TabBar from "../components/TabBar";

// NAVIGATION
import ListCustomerInfoNavigation from '../../list-customer-info/navigations/ListCustomerInfoNavigation';
import ReportNavigation from '../../report/navigations/ReportNavigation';

// SCREEN
// import NextPharse from '../scenes/NextPharse';
import Home from '../scenes/Home';
// import Settings from '../scenes/Settings'
import DeploymentList from '../../deployment/scenes/DeploymentList';
import ExtraServiceNavigation from '../../extra-service/navigations/ExtraServiceNavigation';


//Tab Home
const HomeTabs = createBottomTabNavigator(
    {
        TabHome: { 
            screen: Home 
        },
        TabListCustomerInfo: {
            screen: ListCustomerInfoNavigation,
        },
        // TabExtraService: {
        //     screen: ExtraServiceNavigation,
        // },
        // TabReport : {
        //     screen: ReportNavigation,
        // },
        // TabDeploy : {
        //     screen: DeploymentList,
        // },
    },
    {
        tabBarComponent : (props) => {
            return (
                <TabBar {...props}/>
            );
        },
        tabBarPosition: 'bottom',
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
            showLabel: false,
            showIcon: true,
            style: {
                backgroundColor: '#FFFFFF',
                height:100
            }
        },
        animationEnabled: false,
        swipeEnabled: false,
    }
)

//stack home
export const HomeStack = createStackNavigator(
    {
        StackHome: {
            screen: HomeTabs,
            navigationOptions: ({navigation}) => ({
                header: null,
            })
        },
    },
    {
        initialRouteName: 'StackHome',
        headerMode: 'screen',
        defaultNavigationOptions: ({navigation}) => ({
            headerLeft: <ButtonBack navigation={navigation} />,
            headerStyle: {
                backgroundColor: '#0B76FF',
                borderBottomWidth: 0,
                shadowRadius: 0,
                shadowOffset: {
                    height: 0,
                },
                shadowColor: 'transparent',
                elevation: 0
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
                fontSize    :20,
                fontWeight: 'bold',
            },
            headerRight: <View/>,
        })
    }
)

console.ignoredYellowBox = ['Remote debugger', 'Warning: Each', 'Warning: Failed'];
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
console.disableYellowBox = true;

//Menu
export default createDrawerNavigator({
    MenuHome: {
        screen: HomeTabs
    },
    MenuStack: {
        screen: HomeStack
    },
},{
    contentComponent: (props) => {
        return (
            <MainMenu {...props}/>
        );
    },
    drawerWidth: 300
});
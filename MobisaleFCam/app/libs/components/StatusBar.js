
// LIB
import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper'
import React from 'react';
import { View, StatusBar, StyleSheet, Platform } from 'react-native';

// STYLE ORIGINAL
// const statusBarHeight = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
// const fixIOS = Platform.OS === 'ios' ? {marginTop: -20, zIndex: 2} : {};

//  STYLE FIX 
    // iOS: Ip6, Ip6 Plus
    // iOSx : X, Xs Mas
    // Android: S8, Huawei

const statusBarHeight = Platform.OS === 'ios' ? 20 : 0;
const fixMarginIOS = Platform.OS === 'ios' 
    ? 
        [isIphoneX() ? {marginTop: -20} : {marginTop: -20}, {zIndex: 2}]
    : 
        {marginTop: 20};

const GeneralStatusBarColor = ({ backgroundColor, ...props }) => (
    <View style={[fixMarginIOS, { backgroundColor, height: statusBarHeight }]}> 
        <StatusBar 
            translucent 
            backgroundColor={backgroundColor} {...props} />
    </View>
);

export default GeneralStatusBarColor;
















// // LIB
// import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper'
// import React, { Component } from 'react';
// import { View, StatusBar, StyleSheet, Platform, AppState } from 'react-native';

// // STYLE ORIGINAL
// // const statusBarHeight = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
// // const fixIOS = Platform.OS === 'ios' ? {marginTop: -20, zIndex: 2} : {};

// //  STYLE FIX 
//     // iOS: Ip6, Ip6 Plus
//     // iOSx : X, Xs Mas
//     // Android: S8, Huawei

// class GeneralStatusBarColor extends Component {
//     constructor(props){
//         super(props);

//         this.state = {
//             appState: AppState.currentState,
//             mgT: 20
//         };
//         console.log(1);
//     }

//     // state = {
//     //     appState: AppState.currentState,
//     //     mgT: 20
//     // };

//     componentDidMount() {
//         AppState.addEventListener('change', this._handleAppStateChange);
//     }

//     componentWillUnmount() {
//         AppState.removeEventListener('change', this._handleAppStateChange);
//     }

//     _handleAppStateChange = (nextAppState) => {
//         if ( this.state.appState.match(/inactive|background/) && nextAppState === 'active' ) {
//             console.log('App has come to the foreground!');
//             this.setState({mgT: 20});
//         } else {
//             console.log('App has go to the background!');
//             this.setState({mgT: 0});
//         }
//         this.setState({appState: nextAppState});
//     };

//     render() {

//         const statusBarHeight = Platform.OS === 'ios' ? 20 : 0;
//         const fixMarginIOS = Platform.OS === 'ios' 
//             ? [isIphoneX() ? {marginTop: -20} : {marginTop: -20}, {zIndex: 2}]
//             : {};
//         const { backgroundColor } = this.props;

//         console.log(fixMarginIOS);
//         console.log(backgroundColor)
        

//         return (
//             <View style={[fixMarginIOS, { backgroundColor }, Platform.OS === 'ios' ? statusBarHeight : {} ]}> 
//                 <StatusBar 
//                     translucent 
//                     backgroundColor={backgroundColor} />
//             </View>
//         );
//     }
// }

// export default GeneralStatusBarColor;
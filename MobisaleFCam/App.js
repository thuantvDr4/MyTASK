// LIB
import React, { Component } from 'react';
import { View } from 'react-native';
import CodePush from "react-native-code-push";

// REDUX
import { Provider } from 'react-redux';
import Router from './app/config/routes'
import store from './app/redux/store';

// LIB CUSTOM
import NavigationService from './app/libs/helpers/NavigationService';
import TechAppLoading from './app/libs/components/TechAppLoading';
import TechPushNotification from './app/libs/components/TechPushNotification';
import TechAppModalAction from './app/libs/components/TechAppModalAction';
import TechAppModalWarning from './app/libs/components/TechAppModalWarning';
import CustomStatusBar from './app/libs/components/StatusBar';
import gaTracker from './app/libs/googleAnalytics/gaTracker'

// VARIABLE
let codePushOptions = { 
	// ----- CHECK UPDATE KHI MO APP
	checkFrequency: CodePush.CheckFrequency.MANUAL,
};

// Render
class App extends Component {
    
    render() {
        return (
            <Provider store={store}>
                <View style={{flex:1}}>
                    <CustomStatusBar 
                        backgroundColor="#0B76FF"
                        barStyle="light-content" />
                    
                    <Router 
                        ref={navigatorRef => {
                            NavigationService.setTopLevelNavigator(navigatorRef);
                        }}
                        onNavigationStateChange={gaTracker}
                    />

                    <TechAppLoading />
                    <TechAppModalAction />
                    <TechAppModalWarning />
                    <TechPushNotification />
                </View>            
            </Provider>
        );
    }
}

// EXPORT root
export default CodePush(codePushOptions)(App);



/**
 * NOTE:
 * AppName Android: fCam-Android
 * AppName Ios: fCam-Ios
 * 
 * COMMAND CLI PARAM EXPLAIN:
 * [ -a | --app <ownerName>/<appName> ]             : Name 
 * [ -d | --deployment-name <deploymentName> ]      : Production or Staging (default Staging)
 * [ -x | --disabled <disabled> ]                   : Disable
 * [ -m | --mandatory ]                             : force update (default false)
 * [ -t | --target-binary-version <version> ]       : "*" all version -- version 4 so ko chay dc
 * [ -k | --private-key-path <privateKeyPath> ]     : access key
 * [ -r | --rollout <rolloutPercentage>]            : roll back, e.g "100%"
 * [ --des | --description <description>]           : Description
 * 
 * 
 * 
 * ===================================================================
 * ===================================================================
 * ============================= EXAMPLE =============================
 * ===================================================================
 * ===================================================================
 * 
 * ==================================================> 01. CREATE
    * 
    * =====> USAGE:
    * code-push app add <appName> <os> <platform>
    
    * =====> E.G:
    * code-push app add fCam-Android android react-native
    * code-push app add fCam-Ios ios react-native
    * 
    * 
 * ==================================================> 02. DEPLOYMENT KEY
    * 
    * =====> USAGE:
    * code-push deployment ls <appName> [ options ]
    * [ --format <output json | table> ] -> default table
    * [ -k | --displayKeys ]
    * 
    * =====> E.G:
    * ==>    fCam-Ios
        * code-push deployment ls fCam-Android --format "json" -k
            * Staging: Ln6SXLEvk78wBCjEVu6y1UtoSP4R202f0ad1-9df6-4c30-891c-09eca2f5a870
            * Production: 9c52vX7aZ97oOivJhkI4UUw5RBeL202f0ad1-9df6-4c30-891c-09eca2f5a870
            * 
    * ==>    fCam-Android
        * code-push deployment ls fCam-Ios --format "json" -k
            * Staging: w2P8fME_HcfbY61uHwHVeoUKKVjn202f0ad1-9df6-4c30-891c-09eca2f5a870
            * Production: vLyMY2AlDEmrc65tUb4PdFK3lH23202f0ad1-9df6-4c30-891c-09eca2f5a870
    * 
    * 
 * ==================================================> 03. DEPLOY RELEASE
    * 
    * =====> USAGE:
    * code-push release-react <appName> <platform> [ options ]
    * [ -d | --deploymentName <deploymentName> ]
    * [ -x | --disabled <disabled> ]
    * [ -m | --mandatory ]
    * [ -t | --targetBinaryVersion <targetBinaryVersion> ]
    * [ -r | --rollout <rolloutPercentage> ]
    * [ -k | --privateKeyPath <pathToPrivateKey> ]
    * [ --des | --description <description> ]
    * 
    * =====> E.G:
    * ==>    fCam-iOS
        * Staging: code-push release-react fCam-Ios ios -d "Staging" -m -t "2.0.1" --des "note: thay doi gi do o Staging Ios" -k private.pem
        * Production: code-push release-react fCam-Ios ios -d "Production" -m -t "2.0.1" --des "note: thay doi gi do o Production Ios" -k private.pem
    * 
    * ==>    fCam-Android
        * Staging: code-push release-react fCam-Android android -d "Staging" -m -t "2.0.1" --des "note: thay doi gi do o Staging Android" -k private.pem
        * Production: code-push release-react fCam-Android android -d "Production" -m -t "2.0.2" --des "note: thay doi gi do o Production Android" -k private.pem
    * 
    * 
 * ==================================================> 04. PROMOTE
    * 
    * =====> USAGE:
    * code-push promote <appName> <sourceDeploymentName> <destDeploymentName> [options]
    * [ --des | --description <description> ]
    * [ -l | --label <label> ]
    * [ -x | --disabled <disabled> ]
    * [ -m | --mandatory]
    * [ -r | --rollout <rolloutPercentage> ]
    * [ -t | --targetBinaryVersion <targetBinaryVersion ]
    * 
    * =====> E.G: 
    * Promote (lay ban cap nhat tu Staging -> Production, neu ko muon up bang cau lenh tren len Production)
    * ==>    fCam-iOS
        * code-push promote fCam-Ios "Staging" "Production" -m -t "2.0.1" --des "note: release Staging to Production"
        * 
    * ==>    fCam-Android
        * code-push promote fCam-Android "Staging" "Production" -m -t "2.0.1" --des "note: release Staging to Production"
    * 
    * 
 * ==================================================> 05. PATCH METADATA
    * 
    * =====> USAGE:
    * code-push patch <appName> <deploymentName> [ options ]
    * [ -l | --label <releaseLabel> ]
    * [ -m | --mandatory <isMandatory> ]
    * [ --des | --description <description> ]
    * [ -r | --rollout <rolloutPercentage> ]
    * [ -x | --disabled <isDisabled> ]
    * [ -t | --targetBinaryVersion <targetBinaryVersion>]
    * 
    * =====> E.G:
    * ==>    fCam-iOS
        * Staging: code-push patch fCam-Ios "Staging" -l v1 -m false -t "2.0.1" --des "note: chinh sua lai v1 ios"
        * Production: code-push patch fCam-Android "Staging" -l v1 -m false -t "2.0.1" --des "note: chinh sua lai v1 android"
    * 
    * ==>   fCam-Android
        * Staging: code-push patch fCam-Ios "Production" -l v1 -m false -t "2.0.1" --des "note: chinh sua lai v1 ios"
        * Production: code-push patch fCam-Android "Production" -l v1 -m false -t "2.0.1" --des "note: chinh sua lai v1 android
    * 
    * 
 * ==================================================> 06. CLEAR DEPLOY
    * 
    * =====> USAGE:
    * code-push deployment clear <appName> <deploymentName>
    * 
    * =====> E.G: 
    * ==>    fCam-iOS 
        * Staging: code-push deployment clear fCam-Ios "Staging"
        * Production: code-push deployment clear fCam-Ios "Production"
        * 
    * ==>    fCam-Android
        * Staging: code-push deployment clear fCam-Android "Staging"
        * Production: code-push deployment clear fCam-Android "Production"
 * 
 */

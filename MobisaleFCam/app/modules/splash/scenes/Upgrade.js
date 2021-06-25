// LIB
import React from 'react';
import {Platform, View, Image, Text, Linking} from 'react-native';
import {requestPermission} from 'react-native-android-permissions';
import {strings} from 'locales/i18n';
import RNFetchBlob from 'rn-fetch-blob';
import ReactNativeAPK from "react-native-apk";
import moment from 'moment';

// LIB CUSTOM
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';

// COMPONENT
import ButtonBorder from '../../contract/components/ButtonBorder';

// VARIABLE
import GlobalVariable from '../../../config/globalVariable';

// STYLE
import styles from '../styles';


class Upgrade extends React.Component
{
    static navigationOptions = {
        header: null
    }

    constructor(props)
    {
        super(props);

        this.state = {
            loadingVisible: false,
            versionInfo: this.props.navigation.getParam('info', {})
        };

    }

    processUpdate()
    {
        if (Platform.OS == 'android')
        {
            setTimeout(() => {
                requestPermission("android.permission.WRITE_EXTERNAL_STORAGE")
                .then((result) => {
                    this.updateAndroid();
                }, (result) => {
                    this.refs['popup'].getWrappedInstance().show(strings('dl.dialog.request_rule'));
                });
            }, 0);
        }
        else {
            this.updateIOS();
        }
    }

    updateAndroid()
    {
        this.showLoading(true);


        const url = this.state.versionInfo.Link;
        const dateName = moment(new Date()).format("YYYYMMDD_HHmmss");
        let filename_part = url.split(/[\\/]/).pop();

        filename_part = filename_part.split('.');

        let filename = '';
        let ext = '';

        if (filename_part.length !== 1) {
            ext = filename_part.pop();
        } else {
            ext = 'apk';
        }

        // filename = filename_part.join('.') + '_' + dateName;
        filename = 'MobisaleGlobal' + '_' + dateName;

        const dirs = RNFetchBlob.fs.dirs;
        const filePath = `${dirs.DownloadDir}/${filename}.${ext}`;
        // console.log('FILE_NE', filePath);

        // ReactNativeAPK.installApp('file://' + '/storage/emulated/0/Download/mobisaleglobalstag-a_1554973650021.apk');

        RNFetchBlob.config({
            appendExt: 'apk',
            addAndroidDownloads : {
                useDownloadManager : true,
                notification : true,
                path: filePath,
                mime : 'application/vnd.android.package-archive',
                description : `Download contract file "${filename}"`
            }
        })
        .fetch('GET', url, {
            Authorization : 'Bearer ' + GlobalVariable.kong_token,
        })
        .then((resp) => {
            this.showLoading(false);
            // console.log(resp.path());
            ReactNativeAPK.installApp(resp.path());
        })
        .catch((err) => {
            this.showLoading(false);
            // console.log(err);
            this.refs['popup'].getWrappedInstance().show(strings('dl.upgrade.noti.warnDownload'));
        });
    }


    updateIOS()
    {
        const url = this.state.versionInfo.Link
        Linking.canOpenURL(url)
        .then(supported => {
            if (!supported) {
                this.refs['popup'].getWrappedInstance().show(strings('dl.upgrade.noti.warnHandle') + url);
            } else {
                return Linking.openURL(url);
            }
        })
        .catch(err => console.error('An error occurred', err));
    }

    /**
     * An hien loading
     *
     * @param {*} isShow
     */
    showLoading(isShow)
    {
        this.setState({
            loadingVisible: isShow
        });
    }

    render()
    {
        return (
            <View style={[styles.container, {justifyContent: 'space-between'}]}>
                <Image style={{marginTop: 50}} source={ require('assets/images/splash/__Logo_white.png') } />

                <View style={{marginHorizontal: 24}}>
                    <Text style={{fontSize: 20, color: '#FFF', textAlign: 'center'}}>
                        There is a new version, please update to continue using.
                    </Text>
                </View>

                <View style={{paddingHorizontal: 24, width: '100%', marginBottom: 25}}>
                    <ButtonBorder
                        style={{borderWidth: 0}}
                        title="Update now"
                        onPress={this.processUpdate.bind(this)}
                    />
                </View>

                <PopupWarning ref="popup"/>
                <TechLoading visible={this.state.loadingVisible}/>
            </View>
        );
    }
}

export default Upgrade;

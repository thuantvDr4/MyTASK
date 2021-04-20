// LIB
import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, Platform} from 'react-native';
import Dimensions from 'Dimensions';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';

// REDUX
import {connect} from 'react-redux';

// LANGUAGE
import {strings} from 'locales/i18n';

// LIB CUSTOM
import NavigationService from 'app-libs/helpers/NavigationService';
import ButtonElement from 'app-libs/components/input/ButtonElement';
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';
import showLoading from 'app-libs/helpers/showLoading';

// API
import * as api from '../api';

// CONST
const MAX_IMG = 5;

/**
 * Upload hinh anh phieu TTKH
 * 
 * @author DaiDP
 * @edit Thuandd3
 * @since Sep, 2018
 */
class UploadCustomerImage extends React.Component {

    static navigationOptions = {
        title: strings('list_customer_info.upload_image.title'),
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.state = {
            imgList: [],
            imgListRs: [],
            numProcess: 0,
            loadingVisible: false,
            dataSystemApiToken: '',
            RegID: this.props.navigation.getParam('RegID', '0'),
            RegCode: this.props.navigation.getParam('RegCode', '0'),  
        };

        this.chooseImage = this.chooseImage.bind(this);
    }

    numProcess = 0;
    listId = [];
    listErr = [];

    /**
     * Get System Api Token
     */
    componentDidMount() {
        this.showLoading(true);
        // goi API generation Token
        api.getSystemApiToken({}, (success, result, msg) => {
            this.showLoading(false);

            if (success) {
                this.setState({
                    ...this.state,
                    dataSystemApiToken: result[0].Token
                });
            } else {
                this._error(msg);
            }
        });
    }

    /**
     * Xu ly Upload anh
     */
    processUploadImage() {
        this.showLoading(true);

        setTimeout(() => {
            const {imgList} = this.state;
            this.listErr = [];
            this.listId  = [];

            for(i in imgList) {

                this.numProcess++;
                // console.log('11111', this.numProcess);
                this._uploadImage(imgList[i]);
            }
        }, 0);
        
    }


    /**
     * Tien hanh Upload anh
     */
    _uploadImage(file) {

        this._resizeImg(file, (isSuccess, data) => {
            if (isSuccess) {
                
                const formData = {
                    image: data,
                    imageType: file.mime,
                    //image: this.state.imgList,
                    RegID: this.state.RegID,
                    Username: this.props.Username,
                    dataSystemApiToken: this.state.dataSystemApiToken
                };
                
                api.uploadImage(formData, (isSuccess, data, msg) => {

                    if (isSuccess) {
                        this.listId.push(data.Id);
                    } else {
                        this.listErr.push(msg.message);
                    }
                    
                    this.numProcess--;
                    console.log('22222', this.numProcess);

                    if (this.numProcess === 0) {
                        this.uploadSuccess();
                    }
                });
            } else {
                // 
            }
        })
    }

    /**
     * Xu ly Resize anh
     * @param  
     */
    _resizeImg(file, callback) {
        // resize image before upload
        ImageResizer.createResizedImage(
            file.path, file.width, file.height, "JPEG", 50
        ).then((response) => { 
            return callback(true, response);
        }).catch((err) => {
            return callback(true, err);
        });
    }

    /**
     * Xu ly sau khi up anh
     */
    uploadSuccess()
    {
        if (this.listErr.length != 0) {
            this.showLoading(false);
            this.refs['popup'].getWrappedInstance().show(this.listErr[0]);
            return;
        }

        // tien hanh update
        const data = {
            RegID: this.state.RegID, 
            RegCode: this.state.RegCode,
            ImageInfo: this.listId.join(',')
        };
        
        api.updateRegistrationImage(data, (isSuccess, data, msg) => {
            this.showLoading(false);
            
            if (isSuccess)
            {
                // Lay callback tu nativgation
                const refreshData = this.props.navigation.getParam('refreshData');

                // Callback refresh data
                refreshData && refreshData();

                // Tro ve trang detail
                this.props.navigation.goBack();
                return;
            }
            
            this.refs['popup'].getWrappedInstance().show(msg.message);
        });
    }

    /**
     * Thong bao chua chọn ảnh
     */
    noImage() {
        this.refs['popup'].getWrappedInstance().show(strings('list_customer_info.upload_image.empty_image'));
    }

    /**
     * Xu ly chon hinh anh
     */
    chooseImage() {

        ImagePicker.openPicker({
            multiple: true,
            mediaType: 'photo'
        }).then(images => {
            // merge image old and new select
            let uniImg = [
                ...this.state.imgList,
                ...images
            ]
            console.log(uniImg);
            // unique image select
            uniImg = uniImg.filter((x, i, a) => a.findIndex(
                si => (Platform.OS === 'ios' ? si.sourceURL === x.sourceURL : si.path === x.path)
                ) == i);

            // set state
            this.setState({
                imgList: uniImg.slice(0, MAX_IMG)
            });
        }).catch(error => {
            // nothing to do
        });
    }

    /**
     * An hien loading
     * 
     * @param boolean isShow 
     */
    showLoading(isShow)
    {
        this.setState({
            loadingVisible: isShow
        });
    }

    /**
     * Render image list
     */
    _renderImage()
    {
        let img = [];
        const {imgList} = this.state;

        for (i in imgList) {
            img.push(
                <View style={styles.boxImage} key={"item-" + i}>
                    <Image source={{uri: imgList[i].path}} style={styles.previewIcon} resizeMode="cover"/>
                </View>
            );
        }

        // gioi han toi da 5 hinh
        if (imgList.length < MAX_IMG) 
        {
            img.push(
                <TouchableOpacity style={[styles.boxImage, styles.boxImageBlur]} onPress={this.chooseImage} key="chooseImage">
                    <Image source={require('assets/images/list-customer-info/ic_64Upload.png')} style={styles.uploadIcon}/>
                </TouchableOpacity>
            );
        }

        return img;
    }


    /**
     * Render view
     */
    render()
    {
        if (this.state.imgList.length === 0)
        {
            // render view khi khong chon hinh anh
            return (
                <View style={styles.container}>

                    <View style={styles.outList}>
                        <View style={styles.listImage}>
                            <TouchableOpacity onPress={this.chooseImage}>
                                <Image source={require('assets/images/list-customer-info/ic_64Upload.png')} style={styles.uploadIcon}/>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.note}>{strings('list_customer_info.upload_image.note')}</Text>
                        <Text style={styles.warning}>{strings('list_customer_info.upload_image.warning')}</Text>
                    </View>

                    <View style={[styles.buttonContainer, {marginBottom: 24}]}>
                        <ButtonElement 
                            title={strings('list_customer_info.upload_image.confirm')}
                            onPress={this.noImage.bind(this)}
                        />
                    </View>
                    <PopupWarning ref="popup"/>
                </View>
            );
        }

        // Render view co chon hinh anh
        return(
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    {this._renderImage()}

                    <View style={[styles.boxImage, styles.boxBlank]}></View>
                </View>

                <View style={[styles.buttonContainer, {marginBottom: 24}]}>
                    <ButtonElement 
                        title={strings('list_customer_info.upload_image.confirm')}
                        onPress={this.processUploadImage.bind(this)}
                    />
                </View>

                <PopupWarning ref="popup"/>
                <TechLoading visible={this.state.loadingVisible}/>
            </View>
        );
    }
}

export default connect((state) => {
    return {
        Username: state.authReducer.userInfo.UserName
    }
}, {showLoading})(UploadCustomerImage);

const rows = 3;
const cols = 2;

// const margin = 4;
// const width = (Dimensions.get('window').width / cols) - (margin * (cols + 1));
// const height = ((Dimensions.get('window').height - 130) / rows) - (margin *  (rows + 1));

const margin = 12;
const width = (Dimensions.get('window').width / cols) - (margin + 6);
const height = width;

console.log(width);
console.log(height);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        // justifyContent: 'center',
        // --
        justifyContent: 'flex-start',
        paddingHorizontal: 6,
        paddingTop: 12
    },
    boxImage: {
        // margin: margin,
        justifyContent: 'center',
        alignItems: 'center',
        width: width, height: height,
        borderColor: '#3E86FF',
        borderWidth: 1,
        // --
        marginHorizontal: 6,
        marginBottom: 12,
    },
    boxImageBlur: {
        backgroundColor: '#eff3fe',
    },
    boxBlank: {
        borderWidth: 0
    },
    buttonContainer: {
        paddingHorizontal: 24,
        justifyContent: 'flex-end',
        minHeight: 60,
        marginBottom: 12
    },
    previewIcon: {
        width: width,
        height: height
    },

    // css khong chon hinh
    outList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    listImage: {
        flexDirection: 'row'
    },
    uploadIcon: {
        width: 64,
        height: 64,
        marginHorizontal: 3
    },
    note: {
        fontSize: 14,
        color: '#9a9a9a',
        marginTop: 8
    },
    warning: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '500',
        textAlign: 'center',
        color: '#444',
        marginTop: 16
    }
});

/* 
height:1920
mime:"image/png"
modificationDate:"1536119366000"
path:"file:///data/user/0/com.mobisalefcam/cache/react-native-image-crop-picker/Screenshot_20180830-182309.png"
size:63344
width:1080


**** API Upload
Date:"2018-09-05T14:01:23.353"
Id:382
LinkId:195348536
Path:"D:\WebServices\SystemApi.fpt.vn\Images\MobisaleGlobal\ImageContract\123\2018\09\05\1\195348536\HungTrV_180905140123954.3"
Source:123
Type:"2"
*/
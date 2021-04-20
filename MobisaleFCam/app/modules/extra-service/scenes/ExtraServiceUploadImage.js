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
import TechLoadingProgress from 'app-libs/components/TechLoadingProgress';

// API
import * as api from '../api';

// CONST
const MAX_IMG = 5;

/**
 * Upload hinh anh phieu TTKH
 * 
 * @author Thuandd3
 * @since Jul, 2020
 */
class ExtraServiceUploadImage extends React.Component {

    static navigationOptions = {
        title: strings('list_customer_info.upload_image.title'),
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        this.state = {
            RegID: this.props.navigation.getParam('RegID', '0'),
            RegCode: this.props.navigation.getParam('RegCode', '0'),  
            dataSystemApiToken: '',
            imgList: [], imgListRs: [], imgListTemp: [],
            numProcess: 0,
            loadingVisible: false, loadingProgress: false,
            status: 'waiting', isSuccess: false,
            indeterminate: true, progress: 0,
            quantityChoose: null, quantityDone: 0,
        };

        this.chooseImage = this.chooseImage.bind(this);
        this.processResizeImage = this.processResizeImage.bind(this);
    }

    _isMounted = false;
    numProcess = 0; numResize = 0;
    listId = []; listErr = [];

    /**
     * Get System Api Token
     * 
     */
    componentDidMount() {
        this._isMounted = true;

        // 
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
     * DEMO LOADING DATA
     * 
     */
    animate() {
        let progress = 0;
        this.setState({ progress });

        setTimeout(() => {
            this.setState({ indeterminate: false });
            var myVar = setInterval(() => {
				progress += Math.random() / 5;
				if (progress > 1) {
					progress = 1;
                    clearInterval(myVar);

                    this.setState({ 
                        progress, 
                        // loadingProgress: false,
                        indeterminate: true,
                        isSuccess: true
                    });
				} else {
                    this.setState({ progress});
                }
			}, 500);
        }, 500);
    }

    /**
     * Xoa hinh anh cache Picker
     */
    componentWillUnmount() {
        this._isMounted = false;
        this.processClearImageTemp();
    }

    /**
     * Xu ly xoa anh temp
     * 
     */
    processClearImageTemp() {
        const { imgListRs } = this.state;

        // clear picker image tmp
        ImagePicker.clean().then(() => {
            
            // clear resize image tmp
            for (i in imgListRs) {
                ImagePicker.cleanSingle(imgListRs[i]._resize.path)
                .then(() => { // do somethings
                }).catch(e => { // do somethings
                });
            }
        }).catch(e => { // do somethings
        });
    }

    /**
     * Xu ly Resize anh
     * 
     */
    processResizeImage() {
        
        const { imgListTemp } = this.state;

        // --- SHOW LOADING PERCENT
        if (!this.state.loadingProgress) {
            this.showLoadingProgress(true);
        }
        
        setTimeout(() => {
            if (imgListTemp.length > 0) {
                let temp = []; 
                let { quantityDone } = this.state;
                quantityDone++;
                
                // Lay anh dau tien ra
                temp = imgListTemp.shift();
                this.setState({  ...this.state, quantityDone: quantityDone});

                if (temp.size > 6000000) {
                    // Goi func resize image
                    this._resizeImg(temp, (isSuccess, data, msg) => {

                        if (isSuccess) {
                            
                            // tao ds resizeImg
                            let newData = [ ...this.state.imgListRs, data];
        
                            // set progress
                            this.setState({ imgListRs: newData});
                            
                            // Goi func upload
                            this._uploadImage(data, true);

                        } else {
                            this.refs['popup'].getWrappedInstance().show(msg.message);
                        }
                    });

                } else {
                    // Goi func upload
                    this._uploadImage(temp);
                }

            } else {
                // Ket thuc upload va xu ly sau up
                this.setState({ isSuccess: true });
                setTimeout(() => {
                    this.uploadSuccess();
                }, 2500);
            }
        }, 1000);
    }

    /**
     * Tien hanh Resize anh
     * @param file, 
     * @param callback
     */
    _resizeImg(file, callback) {
        
        // xu ly loading progress
        this.setState({  ...this.state, status: 'resizing'});

        // resize image before upload
        ImageResizer.createResizedImage(
            file.path, file.width, file.height, "JPEG", 50

        ).then((response) => {  
            
            // add object new into
            file['_resize'] = response;
            return callback(true, file, null);

        }).catch((err) => {
            // console.log(err);
            return callback(false, null, {message: err});
        });
    }

    /**
     * Xu ly Upload anh
     * @Note: Hien ko dung toi
     */
    processUploadImage() {
        this.showLoading(true);

        setTimeout(() => {
            const { imgListRs } = this.state;
            this.listErr = [];
            this.listId  = [];

            for (i in imgListRs) {

                this.numProcess++;
                this._uploadImage(imgListRs[i]);
            }
        }, 0);
        
    }

    /**
     * Tien hanh Upload anh
     */
    _uploadImage(file, isResize = false) {
        // set progress
        this.setState({ ...this.state, indeterminate: false, status: 'uploading'});

        const formData = {
            image: isResize ? file._resize : file,
            imageType: file.mime,
            //image: this.state.imgList,
            RegID: this.state.RegID,
            Username: this.props.Username,
            dataSystemApiToken: this.state.dataSystemApiToken
        };

        // call api upload
        api.uploadImage(formData, (isSuccess, data, msg) => {

            if (isSuccess) {
                this.listId.push(data.Id);
                this.setState({  ...this.state, indeterminate: true, progress: 0, status: 'waiting'});
                this.processResizeImage();
                
            } else {
                if (data) {
                    if (msg.progress > 1) {
                        this.setState({  ...this.state, indeterminate: true, progress: 0, status: 'waiting'});
                    } else {
                        this.setState({ ...this.state, progress: msg.progress});
                    }
                } else {
                    this.listErr.push(msg.message);
                }
            }
        });
    }

    /**
     * Xu ly sau khi up anh
     */
    uploadSuccess() {

        if (this.listErr.length != 0) {

            this.showLoadingProgress(false);
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

            this.showLoadingProgress(false);
            
            if (isSuccess) {
                // Lay callback tu nativgation
                // const refreshData = this.props.navigation.getParam('refreshData');

                // Callback refresh data
                // refreshData && refreshData();

                // Tro ve trang details customer
                setTimeout(() => {
                    this.props.navigation.goBack();
                }, 500);
                
                return;
            } else {
                this.refs['popup'].getWrappedInstance().show(msg.message);
            }
        });
    }

    /**
     * Xu ly chon hinh anh
     * 
     */
    chooseImage() {

        ImagePicker.openPicker({
            multiple: true,
            mediaType: 'photo'

        }).then(images => {
            // merge image old and new select
            let myImg = [
                ...this.state.imgList,
                ...images
            ]
            
            // unique image select
            // UPDATE V2.3.1
            // sourceURL NULL   
            uniImg = myImg.filter((x, i, a) => 
                a.findIndex((si) => (Platform.OS === 'ios' 
                    ? (si.filename === x.filename && si.size === x.size) 
                    : si.path === x.path)) == i
            );

            // set state
            this.setState({
                imgList: uniImg.slice(0, MAX_IMG),
                imgListTemp: uniImg.slice(0, MAX_IMG),
                quantityChoose: uniImg.slice(0, MAX_IMG).length
            });
        }).catch(error => {
            // nothing to do
        });
    }

    /**
     * Status cho loading upload
     * 
     */
    _status(kind) {
        let status;

        switch (kind) {
            case 'resizing':
                status = 'resizing... ' + this.state.quantityDone + '/' + this.state.quantityChoose; break;
            
            case 'uploading':
                status = 'uploading... ' + this.state.quantityDone + '/' + this.state.quantityChoose; break;

            case 'waiting':
                status = 'waiting for process... '; break;

            default:
                break;
        }

        return status;
    }

    /**
     * Thong bao chua chọn ảnh
     * 
     */
    noImage() {
        this.refs['popup'].getWrappedInstance().show(strings('dl.list_customer_info.upload_image.empty_image'));
    }

    /**
     * An hien loading
     * @param boolean isShow 
     */
    showLoading(isShow) {
        this.setState({
            loadingVisible: isShow
        });
    }

    /**
     * An hien loading progress
     * @param boolean isShow 
     */
    showLoadingProgress(isShow) {
        this.setState({
            loadingProgress: isShow
        });
    }

    /**
     * Render image list
     * 
     */
    _renderImage() {

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
    render() {

        let status = this._status(this.state.status);

        if (this.state.imgList.length === 0) {
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
                    <TechLoading visible={this.state.loadingVisible}/>
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
                        onPress={this.processResizeImage.bind(this)}
                    />
                </View>

                <PopupWarning ref="popup"/>
                <TechLoading visible={this.state.loadingVisible}/>
                <TechLoadingProgress 
                    // for modal
                    visible={this.state.loadingProgress}
                    animation={'fade'}
                    overlayColor={'rgba(0, 0, 0, 0.5)'}
                    // for progress
                    progress={this.state.progress}
                    success={this.state.isSuccess}
                    indeterminate={this.state.indeterminate}
                    textContent={
                        !this.state.isSuccess ? status : ('Upload finish, please waiting!')
                    }
                />
            </View>
        );
    }
}

export default connect((state) => {
    return {
        Username: state.authReducer.userInfo.UserName
    }
}, {})(ExtraServiceUploadImage);

const rows = 3;
const cols = 2;

// const margin = 4;
// const width = (Dimensions.get('window').width / cols) - (margin * (cols + 1));
// const height = ((Dimensions.get('window').height - 130) / rows) - (margin *  (rows + 1));

const margin = 12;
const width = (Dimensions.get('window').width / cols) - (margin + 6);
const height = width;

// console.log(width);
// console.log(height);

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
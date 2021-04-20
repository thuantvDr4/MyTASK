import React from 'react';
import {StyleSheet, Text, ScrollView, View, Image, TouchableOpacity} from 'react-native';
import {strings} from 'locales/i18n';
import * as api from '../api';
import TechLoading from 'app-libs/components/TechLoading';
import RNFetchBlob from 'rn-fetch-blob';

class ExtraServiceViewImage extends React.Component {
    static navigationOptions = {
        title: 'View cus info image',
        headerRight: <View/>
    };

    constructor(props) {
        super(props);

        // Lay thong tin dataSystemApiToken duoc truyen qua tu navigation
        const dataSystemApiToken = this.props.navigation.getParam('dataSystemApiToken');

        this.state = {
            img: [],
            mainImg: null,
            dataSystemApiToken: dataSystemApiToken
        }
    }

    /**
     * Download hinh anh
     */
    componentDidMount() {
        // Explode hinh anh thanh array
        this.showLoading(true);
        const img2 = this.props.navigation.getParam('listImage', '').split(',');
        const dataSystemApiToken = this.state.dataSystemApiToken;

        var numProcess = 0;
        
        for (i in img2) {
            numProcess++;
            const index = i;

            // Chay multi thread
            api.downloadImage(img2[i], dataSystemApiToken, (isSuccess, imageData, msg) => {
                // Tat loading khi chay het 
                numProcess--;
                if (numProcess === 0) {
                    this.showLoading(false);
                }

                // Khong xu ly gi khi co loi xay ra
                if (! isSuccess) {
                    return;
                }

                const {img} = this.state;
                img[index] = 'file://' + imageData;

                this.setState({
                    img: img,
                    mainImg: img[0]
                });
            });
        }
    }

    /**
     * Xoa hinh anh cache
     */
    componentWillUnmount() {
        
        const {img} = this.state;

        for (i in img) {
            RNFetchBlob.fs.unlink(img[i].replace("file://", ""));
        }
    }

    /**
     * An hien loading
     * 
     * @param boolean isShow 
     */
    showLoading(isShow) {

        this.setState({
            loadingVisible: isShow
        });
    }

    changeImage(index) {

        this.setState({
            mainImg: this.state.img[index]
        });
    }

    _renderThumb() {

        const {img} = this.state;
        let listItem = [];

        for (i in img)
        {
            const index = i;

            listItem.push(
                <TouchableOpacity onPress={() => this.changeImage(index)} key={"image_item_" + i}>
                    <Image source={{uri: img[i]}} style={styles.thumbImage} resizeMethod="resize"/>
                </TouchableOpacity>
            );
        }

        return listItem;
    }

    render() {

        if (this.state.img.length === 0 && !this.state.loadingVisible) {

            return (
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{textAlign: 'center'}}>You have not uploaded image yet</Text>
                </View>
            );
        }
        
        return (
            <View style={styles.container}>
                <View style={styles.outMainImg}>
                    {this.state.mainImg 
                        ? <Image source={{uri: this.state.mainImg}} style={styles.mainImage} resizeMode="center" resizeMethod="resize"/> 
                        : null }
                </View>

                <View style={{minWidth: 100, marginBottom: 24}}>
                    <ScrollView horizontal={true} style={styles.thumbScroll}>
                        <View style={styles.thumbList}>
                            {this._renderThumb()}
                        </View>
                    </ScrollView>
                </View>
                <TechLoading visible={this.state.loadingVisible}/>
            </View>
        );
    }
}

export default ExtraServiceViewImage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    outMainImg: {
        flex: 1,
        marginHorizontal: 5,
        marginTop: 5
    },
    mainImage: {
        width: '100%',
        height: '100%'
    },
    thumbScroll: {
        //flex: 0.1,
        minWidth: '100%',
        maxHeight: 100,
    },
    thumbImage: {
        width: 100,
        height: 100,
        marginHorizontal: 5
    },
    thumbList: {
        flexDirection: 'row',
        marginVertical: 8,
        paddingHorizontal: -5
    }
});
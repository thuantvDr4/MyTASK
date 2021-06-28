/*
* SCREEN:  Choose type service
* code by: thuantv
* date: 20/04/2021
* */

// LIB
import React from 'react';
import {
    View, KeyboardAvoidingView,
    ScrollView, Alert, Text, Platform,
    TouchableOpacity, StyleSheet
} from 'react-native';
import {strings} from 'locales/i18n';
import {HeaderBackButton} from 'react-navigation';
// LIB CUSTOM
import NavigationService from 'app-libs/helpers/NavigationService';
import {mapLocation} from 'app-libs/helpers/mapPicker';
// STYLE
import ols from '../../../styles/Ola-style';


/*
*
* CLASS
* */
class ChooseServiceType extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: strings('sale_new.choose_type.title'),
        headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} tintColor="#fff"/>
    });

    constructor(props) {
        super(props);

        this.state = {
            cusType: this.props.navigation.getParam('cusType', null),
        };

    }

    componentDidMount() {
      const _cusType = this.props.navigation.getParam('cusType', null);

    }

    /*
    * gotoInternetService
    * */
    gotoInternetService =()=>{
        NavigationService.navigate('BookPort');
    };

    /*
    * gotoOpenSafeService
    * */
    gotoOpenSafeService =()=>{
        NavigationService.navigate('OpenSafe_Info');
    };


    render() {

        return (
            <ScrollView
                scrollEnabled={false}
                keyboardDismissMode={'on-drag'}
                contentContainerStyle={[ols.wrapper_scrollview]}
            >
                <View style={[styles.main_ctn]}>

                    <TouchableOpacity
                        onPress={this.gotoInternetService}
                        style={[styles.button_ctn]}>
                        <Text style={[styles.fz14_400]}>{strings('sale_new.choose_type.internet')}</Text>
                    </TouchableOpacity>
                    {/*...white-space...*/}
                    <View style={{height: 13}}/>
                    {/*....*/}
                    {this.state.cusType === 'Potential'?
                        <TouchableOpacity
                            disabled={true}
                            style={[styles.button_ctn_disabled, ]}>
                            <Text style={[styles.fz14_400, {color: '#bdbdbd'}]}>{strings('sale_new.choose_type.open_safe')}</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            onPress={this.gotoOpenSafeService}
                            style={[styles.button_ctn]}>
                            <Text style={[styles.fz14_400]}>{strings('sale_new.choose_type.open_safe')}</Text>
                        </TouchableOpacity>

                    }

                </View>
            </ScrollView>
        );
    }
}

/*
* StyleSheet
* */
const styles = StyleSheet.create({
    main_ctn: {
        paddingHorizontal: 20,
        paddingTop: 22
    },
    button_ctn: {
        height: 43,
        borderWidth: 1,
        borderColor: '#0B76FF',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    fz14_400:{
        fontSize: 14,
        fontWeight: '400',
        color: '#0B76FF'
    },
    button_ctn_disabled: {
        height: 43,
        borderWidth: 1,
        borderColor: '#bdbdbd',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },

});

export default ChooseServiceType
